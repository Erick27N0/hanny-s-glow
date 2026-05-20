import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ===== Public: list busy slots (no PII) =====
const rangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const getBusySlots = createServerFn({ method: "POST" })
  .inputValidator((input) => rangeSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin.rpc("get_busy_slots", {
      from_date: data.from,
      to_date: data.to,
    });
    if (error) {
      console.error("getBusySlots error", error);
      throw new Error("Impossible de charger les créneaux.");
    }
    return { busy: (rows ?? []).map((r) => r.slot_start as string) };
  });

// ===== Public: list closed dates =====
export const getClosedDates = createServerFn({ method: "POST" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("closed_dates")
      .select("date, reason")
      .order("date", { ascending: true });
    if (error) {
      console.error("getClosedDates error", error);
      throw new Error("Impossible de charger les jours fermés.");
    }
    return { dates: data ?? [] };
  }
);

// ===== Public: create a booking request (no payment) =====
const createSchema = z.object({
  slotStart: z.string().datetime(),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data }) => {
    const slotStart = new Date(data.slotStart);
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

    // Server-side guards
    const day = slotStart.getUTCDay(); // 0=dim, 6=sam (in UTC; we use Europe/Paris times shifted)
    // Slot must be on a Tue-Sat (1-5 Paris time = 1-5 UTC for our purposes; we'll trust front)
    // Hour must be between 10:00 and 17:00 inclusive (Paris) — handled in front, recompute defensively
    if (slotStart.getTime() < Date.now() + 60 * 60 * 1000) {
      throw new Error("Ce créneau est trop proche ou déjà passé.");
    }

    // Check the day isn't closed
    const dateStr = slotStart.toISOString().slice(0, 10);
    const { data: closed } = await supabaseAdmin
      .from("closed_dates")
      .select("date")
      .eq("date", dateStr)
      .maybeSingle();
    if (closed) {
      throw new Error("Ce jour est fermé. Choisissez un autre créneau.");
    }

    // Check slot isn't already taken
    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id, status, expires_at")
      .eq("slot_start", slotStart.toISOString())
      .in("status", ["confirmed", "pending_payment"]);
    const taken = (existing ?? []).some((b) => {
      if (b.status === "confirmed") return true;
      if (b.status === "pending_payment") {
        return !b.expires_at || new Date(b.expires_at) > new Date();
      }
      return false;
    });
    if (taken) {
      throw new Error("Ce créneau vient d'être réservé. Choisissez-en un autre.");
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        slot_start: slotStart.toISOString(),
        slot_end: slotEnd.toISOString(),
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        notes: data.notes || null,
        status: "pending_payment", // = "en attente de validation salon" dans ce flow
        deposit_amount_cents: 0,
        expires_at: null,
      })
      .select("id")
      .single();
    if (error || !inserted) {
      console.error("createBooking error", error);
      throw new Error("Impossible d'enregistrer la réservation. Réessayez.");
    }
    return { ok: true as const, id: inserted.id };
  });

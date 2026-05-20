import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) {
    console.error("assertAdmin error", error);
    throw new Error("Erreur d'autorisation");
  }
  if (!data) throw new Error("Accès réservé aux administrateurs");
}

export const checkIsAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const listSubmissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [contacts, appointments, inquiries, bookings, closedDates] = await Promise.all([
      supabaseAdmin
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("appointment_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("product_inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("bookings")
        .select("*")
        .order("slot_start", { ascending: false })
        .limit(300),
      supabaseAdmin
        .from("closed_dates")
        .select("*")
        .order("date", { ascending: true }),
    ]);
    if (
      contacts.error ||
      appointments.error ||
      inquiries.error ||
      bookings.error ||
      closedDates.error
    ) {
      throw new Error("Erreur de chargement des demandes");
    }
    return {
      contacts: contacts.data ?? [],
      appointments: appointments.data ?? [],
      inquiries: inquiries.data ?? [],
      bookings: bookings.data ?? [],
      closedDates: closedDates.data ?? [],
    };
  });

const updateStatusSchema = z.object({
  table: z.enum(["contact_messages", "appointment_requests", "product_inquiries"]),
  id: z.string().uuid(),
  status: z.enum(["new", "read", "handled"]),
});

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateStatusSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from(data.table)
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error("Mise à jour impossible");
    return { ok: true as const };
  });

// ===== Bookings =====
const updateBookingSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending_payment", "confirmed", "cancelled", "completed"]),
});

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateBookingSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) {
      console.error("updateBookingStatus error", error);
      throw new Error("Mise à jour impossible");
    }
    return { ok: true as const };
  });

// ===== Closed dates =====
const addClosedSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().max(200).optional().or(z.literal("")),
});

export const addClosedDate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => addClosedSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("closed_dates")
      .insert({ date: data.date, reason: data.reason || null });
    if (error) {
      console.error("addClosedDate error", error);
      throw new Error("Impossible d'ajouter le jour fermé.");
    }
    return { ok: true as const };
  });

const removeClosedSchema = z.object({ id: z.string().uuid() });

export const removeClosedDate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => removeClosedSchema.parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("closed_dates")
      .delete()
      .eq("id", data.id);
    if (error) {
      console.error("removeClosedDate error", error);
      throw new Error("Suppression impossible.");
    }
    return { ok: true as const };
  });

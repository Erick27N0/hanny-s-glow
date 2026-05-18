import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) {
      console.error("submitContact error", error);
      throw new Error("Impossible d'enregistrer le message. Réessayez plus tard.");
    }
    return { ok: true as const };
  });

const appointmentSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  situation: z.string().trim().min(5).max(1000),
  oncologyCenter: z.string().trim().max(200).optional().or(z.literal("")),
  preferredSlot: z.string().trim().max(200).optional().or(z.literal("")),
});

export const submitAppointment = createServerFn({ method: "POST" })
  .inputValidator((input) => appointmentSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("appointment_requests").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      situation: data.situation,
      oncology_center: data.oncologyCenter || null,
      preferred_slot: data.preferredSlot || null,
    });
    if (error) {
      console.error("submitAppointment error", error);
      throw new Error("Impossible d'enregistrer la demande. Réessayez plus tard.");
    }
    return { ok: true as const };
  });

const productInquirySchema = z.object({
  productSlug: z.string().trim().min(1).max(200),
  productName: z.string().trim().min(1).max(200),
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(30),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const submitProductInquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => productInquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("product_inquiries").insert({
      product_slug: data.productSlug,
      product_name: data.productName,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      message: data.message || null,
    });
    if (error) {
      console.error("submitProductInquiry error", error);
      throw new Error("Impossible d'enregistrer la demande. Réessayez plus tard.");
    }
    return { ok: true as const };
  });

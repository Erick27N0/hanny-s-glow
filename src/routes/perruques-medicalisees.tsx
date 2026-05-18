import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepsList } from "@/components/steps-list";
import { wigFaq } from "@/data/faq";
import { submitAppointment } from "@/lib/submissions.functions";
import medicalImg from "@/assets/medical-wigs.jpg";

export const Route = createFileRoute("/perruques-medicalisees")({
  head: () => ({
    meta: [
      { title: "Perruques médicalisées & Sécu — Hanny Tresse Perpignan" },
      {
        name: "description",
        content:
          "Perruques médicales avec prise en charge Sécurité sociale à Perpignan. Accompagnement bienveillant, tiers payant et conseils personnalisés.",
      },
      { property: "og:title", content: "Perruques médicalisées — Hanny Tresse Perpignan" },
      {
        property: "og:description",
        content:
          "Accompagnement bienveillant et remboursement Sécu pour votre prothèse capillaire.",
      },
    ],
  }),
  component: WigsPage,
});

const patientSteps = [
  { title: "Ordonnance", description: "Demandez à votre médecin une prescription de prothèse capillaire." },
  { title: "Premier contact", description: "Appelez-nous ou envoyez le formulaire ci-dessous." },
  { title: "Essayage", description: "Rendez-vous privé d'environ 1h dans un espace dédié." },
  { title: "Validation & pose", description: "Ajustement final, conseils d'entretien, pose offerte." },
  { title: "Remboursement", description: "Nous gérons le tiers payant Sécu (classe I) et votre mutuelle." },
];

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  situation: z.string().trim().min(5, "Précisez votre situation").max(500),
  oncologyCenter: z.string().trim().max(200).optional(),
  preferredSlot: z.string().trim().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function WigsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    // TODO Phase 2: brancher au backend (Lovable Cloud)
    await new Promise((r) => setTimeout(r, 600));
    console.log("wig request", values);
    toast.success("Demande envoyée", {
      description: "Nous vous recontactons sous 24h ouvrées.",
    });
    reset();
  };

  return (
    <>
      <section className="container mx-auto grid gap-10 px-4 pt-14 md:grid-cols-2 md:items-center md:px-6 md:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> Prise en charge Sécu
          </span>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            Une perruque qui vous ressemble, dans un cadre bienveillant.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Nous accompagnons les patientes confrontées à une alopécie médicale.
            Tiers payant Sécu, mutuelles partenaires et essayage en espace privé.
          </p>
        </div>
        <img
          src={medicalImg}
          alt="Perruque médicale présentée dans un cadre apaisé"
          width={1280}
          height={960}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
        />
      </section>

      {/* Pédagogie */}
      <section className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-serif text-lg">Qui est concerné ?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Toute personne en perte de cheveux liée à un traitement médical
              (chimiothérapie, pelade, alopécie cicatricielle…).
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-serif text-lg">L'ordonnance</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Demandez à votre médecin une prescription mentionnant
              « prothèse capillaire ». C'est la seule pièce nécessaire.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-serif text-lg">Remboursement</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Classe I : 350 € pris en charge à 100%. Classe II : 250 €
              remboursés, complément possible par la mutuelle.
            </p>
          </Card>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 max-w-2xl font-serif text-3xl md:text-4xl">
            Votre parcours en 5 étapes
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {patientSteps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary font-serif text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-serif text-base">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <h2 className="mb-6 max-w-2xl font-serif text-3xl md:text-4xl">
          Questions fréquentes
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl">
          {wigFaq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-serif text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Form */}
      <section id="rdv-perruque" className="bg-secondary/40 py-16 md:py-20">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-5 md:px-6">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl md:text-4xl">Demander un rendez-vous</h2>
            <p className="mt-3 text-muted-foreground">
              Renseignez vos coordonnées et votre situation : nous vous recontactons
              sous 24h ouvrées pour fixer un essayage.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-3xl border border-border bg-card p-7 md:col-span-3"
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input id="fullName" {...register("fullName")} aria-invalid={!!errors.fullName} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oncologyCenter">Centre d'oncologie (optionnel)</Label>
              <Input id="oncologyCenter" {...register("oncologyCenter")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preferredSlot">Créneau souhaité (optionnel)</Label>
              <Input id="preferredSlot" placeholder="Ex : mardi après-midi" {...register("preferredSlot")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="situation">Votre situation *</Label>
              <Textarea id="situation" rows={4} {...register("situation")} aria-invalid={!!errors.situation} />
              {errors.situation && <p className="text-xs text-destructive">{errors.situation.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

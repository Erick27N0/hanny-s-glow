import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ShieldCheck, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { wigFaq } from "@/data/faq";
import { getMedicalWigs } from "@/data/products";
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
  { title: "Réservation", description: "Choisissez votre créneau en ligne en quelques clics." },
  { title: "Essayage", description: "Rendez-vous privé d'environ 1h dans un espace dédié." },
  { title: "Validation & pose", description: "Ajustement final, conseils d'entretien, pose offerte." },
  { title: "Remboursement", description: "Nous gérons le tiers payant Sécu (classe I) et votre mutuelle." },
];

function WigsPage() {
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
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/reservation">
                <CalendarDays className="mr-1 h-4 w-4" /> Réserver un essayage
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Poser une question</Link>
            </Button>
          </div>
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

      {/* Catalogue */}
      <section id="modeles" className="container mx-auto px-4 pb-4 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">Nos modèles disponibles</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prix indicatifs avant remboursement Sécurité sociale (classe I : −350 €).
            </p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getMedicalWigs().map((p) => (
            <Link
              key={p.slug}
              to="/boutique/$productSlug"
              params={{ productSlug: p.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
            >
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                <Badge variant="secondary" className="text-[10px]">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Éligible Sécu
                </Badge>
                <h3 className="font-serif text-lg leading-tight">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.shortDescription}</p>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="font-serif text-xl text-primary">{p.price} €</span>
                  <span className="text-xs text-muted-foreground">{p.length}</span>
                </div>
                <div className="flex items-center gap-1 pt-1 text-xs font-medium text-primary">
                  Voir la fiche <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
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

      {/* CTA Réservation */}
      <section id="rdv-perruque" className="bg-secondary/40 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl px-4 text-center md:px-6">
          <CalendarDays className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-serif text-3xl md:text-4xl">
            Réservez votre essayage en ligne
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Choisissez votre créneau d'une heure, du mardi au samedi entre 10h
            et 18h. Le salon valide votre rendez-vous sous 24h ouvrées.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/reservation">Voir les créneaux disponibles</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Une question ? Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}


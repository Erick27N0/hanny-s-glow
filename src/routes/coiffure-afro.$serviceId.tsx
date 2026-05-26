import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServiceById, formatDuration, services } from "@/data/services";

export const Route = createFileRoute("/coiffure-afro/$serviceId")({
  loader: ({ params }) => {
    const service = getServiceById(params.serviceId);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    const title = s
      ? `${s.name} — Coiffure afro à Perpignan | Hanny Tresse`
      : "Prestation — Hanny Tresse";
    const description = s
      ? `${s.description} À partir de ${s.priceFrom} € — durée ${formatDuration(s.durationMinutes)}. Réservation au salon Hanny Tresse Perpignan.`
      : "Découvrez nos prestations coiffure afro.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(s ? [{ property: "og:image", content: s.image }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-serif text-3xl">Prestation introuvable</h1>
      <p className="mt-3 text-muted-foreground">
        Cette prestation n'existe pas ou n'est plus disponible.
      </p>
      <Button asChild className="mt-6">
        <Link to="/coiffure-afro">Voir toutes les prestations</Link>
      </Button>
    </section>
  ),
  errorComponent: () => (
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-serif text-3xl">Une erreur est survenue</h1>
      <Button asChild className="mt-6">
        <Link to="/coiffure-afro">Retour aux prestations</Link>
      </Button>
    </section>
  ),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { service: s } = Route.useLoaderData();
  const related = services.filter(
    (x) => x.category === s.category && x.id !== s.id
  ).slice(0, 3);

  return (
    <>
      <section className="container mx-auto px-4 pt-10 md:px-6 md:pt-14">
        <Link
          to="/coiffure-afro"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Toutes les prestations
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start">
          <div className="overflow-hidden rounded-3xl border border-border">
            <img
              src={s.image}
              alt={s.name}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
          </div>

          <div>
            <Badge variant="secondary">{s.category}</Badge>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">{s.name}</h1>
            <p className="mt-4 text-muted-foreground">{s.longDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <span className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                {formatDuration(s.durationMinutes)}
              </span>
              <span className="hidden h-5 w-px bg-border sm:block" />
              <span className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-primary" />à partir de{" "}
                {s.priceFrom} €
              </span>
            </div>
            {s.priceNote && (
              <p className="mt-2 text-xs text-muted-foreground">{s.priceNote}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Prendre rendez-vous</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/reservation">Voir le calendrier</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">
              Pourquoi choisir
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              Les bénéfices
            </h2>
          </div>
          <ul className="md:col-span-2 space-y-3">
            {s.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Étapes */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-14 md:px-6 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">
            Comment ça se passe
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl">
            Le déroulé de la prestation
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {s.steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="font-serif text-lg">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Inclus + Entretien */}
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-serif text-xl">Inclus dans la prestation</h3>
            <ul className="mt-4 space-y-2">
              {s.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-serif text-xl">Conseils d'entretien</h3>
            <ul className="mt-4 space-y-2">
              {s.aftercare.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {s.faqs.length > 0 && (
        <section className="container mx-auto px-4 pb-14 md:px-6 md:pb-20">
          <h2 className="font-serif text-2xl md:text-3xl">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="mt-6">
            {s.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Prestations associées */}
      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-14 md:px-6 md:py-20">
            <h2 className="font-serif text-2xl md:text-3xl">
              Autres prestations {s.category.toLowerCase()}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/coiffure-afro/$serviceId"
                  params={{ serviceId: r.id }}
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary"
                >
                  <Badge variant="secondary" className="w-fit">
                    {r.category}
                  </Badge>
                  <h3 className="mt-3 font-serif text-lg group-hover:text-primary">
                    {r.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />{" "}
                      {formatDuration(r.durationMinutes)}
                    </span>
                    <span className="font-medium">à partir de {r.priceFrom} €</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="container mx-auto px-4 pb-20 md:px-6">
        <div className="rounded-3xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="font-serif text-2xl md:text-3xl">
            Envie de réserver cette prestation ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Contactez-nous pour un diagnostic offert ou choisissez directement
            un créneau dans le calendrier.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/reservation">Voir le calendrier</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

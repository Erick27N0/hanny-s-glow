import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type Props = {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: "/contact" | "/perruques-medicalisees" | "/boutique" | "/coiffure-afro";
  secondaryLabel?: string;
  secondaryTo?: "/contact" | "/perruques-medicalisees" | "/boutique" | "/coiffure-afro";
};

export function CTASection({
  title = "Envie d'un nouveau look ou besoin de conseils ?",
  description = "Réservez votre rendez-vous au salon, par téléphone ou via WhatsApp. Nous vous répondons rapidement.",
  primaryLabel = "Prendre rendez-vous",
  primaryTo = "/contact",
  secondaryLabel = "Découvrir la boutique",
  secondaryTo = "/boutique",
}: Props) {
  return (
    <section className="container mx-auto px-4 py-20 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-accent/15 to-secondary p-10 text-center md:p-16">
        <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{description}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to={primaryTo}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to={secondaryTo}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, Check, ChevronLeft, Droplets, HeartHandshake, Package, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getProductBySlug } from "@/data/products";
import { submitProductInquiry } from "@/lib/submissions.functions";

export const Route = createFileRoute("/boutique/$productSlug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.productSlug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Boutique Hanny Tresse` },
          { name: "description", content: loaderData.product.shortDescription },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.shortDescription },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-serif text-3xl">Produit introuvable</h1>
      <Button asChild className="mt-6">
        <Link to="/boutique">Retour à la boutique</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  message: z.string().trim().max(800).optional(),
});
type Values = z.infer<typeof schema>;

function ProductPage() {
  const { product } = Route.useLoaderData();
  const submit = useServerFn(submitProductInquiry);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    try {
      await submit({
        data: {
          ...values,
          message: values.message ?? "",
          productSlug: product.slug,
          productName: product.name,
        },
      });
      toast.success("Demande envoyée", {
        description: `Nous vous recontactons au sujet de « ${product.name} ».`,
      });
      reset();
    } catch (err) {
      toast.error("Envoi impossible", {
        description: err instanceof Error ? err.message : "Réessayez plus tard.",
      });
    }
  };

  const isMedical = product.category === "Perruques médicales";
  const reste = Math.max(0, product.price - 350);

  return (
    <section className="container mx-auto px-4 py-10 md:px-6 md:py-16">
      {isMedical ? (
        <Link
          to="/perruques-medicalisees"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Retour aux perruques médicales
        </Link>
      ) : (
        <Link
          to="/boutique"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" /> Retour à la boutique
        </Link>
      )}

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-3xl bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-primary">{product.price} €</span>
            <span className="text-sm text-muted-foreground">
              {product.inStock ? "En stock" : "Sur commande (~10 jours)"}
            </span>
          </div>

          {isMedical && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Prise en charge Sécurité sociale</p>
                <p className="mt-1 text-muted-foreground">
                  Classe I : 350 € remboursés à 100% sur ordonnance. Reste à charge
                  estimé : <span className="font-medium text-foreground">~{reste} €</span>{" "}
                  (avant mutuelle).
                </p>
              </div>
            </div>
          )}

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 text-sm">
            <div>
              <dt className="text-muted-foreground">Type de cheveux</dt>
              <dd className="mt-0.5 font-medium">{product.hairType}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Longueur</dt>
              <dd className="mt-0.5 font-medium">{product.length}</dd>
            </div>
            {product.medical && (
              <>
                <div>
                  <dt className="text-muted-foreground">Couleur</dt>
                  <dd className="mt-0.5 font-medium">{product.medical.color}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Style</dt>
                  <dd className="mt-0.5 font-medium">{product.medical.style}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Densité</dt>
                  <dd className="mt-0.5 font-medium">{product.medical.density}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Monture</dt>
                  <dd className="mt-0.5 font-medium">{product.medical.cap}</dd>
                </div>
              </>
            )}
          </dl>

          {product.highlights.length > 0 && (
            <ul className="mt-5 space-y-1.5 text-sm">
              {product.highlights.map((h: string) => (
                <li key={h} className="flex items-center gap-2 text-foreground/80">
                  <Check className="h-4 w-4 text-primary" /> {h}
                </li>
              ))}
            </ul>
          )}

          {isMedical && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg">
                <Link to="/reservation" search={{ modele: product.slug }}>
                  <CalendarDays className="mr-1 h-4 w-4" /> Réserver un essayage
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg">
                <a href="#question-modele">Poser une question</a>
              </Button>
            </div>
          )}

          <form
            id="question-modele"
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6"
            noValidate
          >
            <p className="font-serif text-lg">
              {isMedical ? "Une question sur ce modèle ?" : "Demander ce produit"}
            </p>
            <p className="-mt-2 text-sm text-muted-foreground">
              {isMedical
                ? "Notre équipe vous répond sous 24h ouvrées. Pour un essayage, réservez directement un créneau ci-dessus."
                : "Parcours d'achat en mode test : envoyez votre demande, nous vous recontactons pour valider la commande."}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nom *</Label>
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
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea id="message" rows={3} {...register("message")} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Envoi..."
                : isMedical
                  ? "Envoyer ma question"
                  : "Commander ce produit"}
            </Button>
          </form>
        </div>
      </div>

      {product.medical && (
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <UserCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-serif text-lg">Pour qui ?</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {product.medical.bestFor.map((b: string) => (
                <li key={b} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-serif text-lg">Morphologies adaptées</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.medical.faceShapes.map((f: string) => (
                <Badge key={f} variant="secondary">{f}</Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Ajustement final personnalisé en cabine selon votre visage.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-serif text-lg">Inclus dans la prestation</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {product.medical.included.map((i: string) => (
                <li key={i} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Droplets className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-serif text-lg">Conseils d'entretien</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {product.medical.care.map((c: string) => (
                <li key={c} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {product.medical && (
        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <HeartHandshake className="h-8 w-8 flex-shrink-0 text-primary" />
            <div>
              <h2 className="font-serif text-xl">Pas encore sûre de votre choix ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Réservez un essayage privé d'1h — sans engagement. Nous comparons
                plusieurs modèles ensemble pour trouver le vôtre.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/reservation">
                <CalendarDays className="mr-1 h-4 w-4" /> Réserver un essayage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/perruques-medicalisees">Voir les autres modèles</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

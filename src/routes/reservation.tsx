import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, Check, ShieldCheck, Sparkles, Download, CalendarPlus, MapPin } from "lucide-react";
import { getProductBySlug } from "@/data/products";
import { downloadICS, googleCalendarUrl, type CalendarEvent } from "@/lib/ics";



import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  getBusySlots,
  getClosedDates,
  createBooking,
} from "@/lib/booking.functions";

export const Route = createFileRoute("/reservation")({
  validateSearch: (search: Record<string, unknown>) => ({
    modele: typeof search.modele === "string" ? search.modele : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Réserver un essayage — Perruques médicalisées Hanny Tresse" },
      {
        name: "description",
        content:
          "Choisissez votre créneau pour un essayage privé de perruque médicalisée à Perpignan. Mardi à samedi, 10h-18h.",
      },
      {
        property: "og:title",
        content: "Réserver un essayage — Hanny Tresse Perpignan",
      },
      {
        property: "og:description",
        content:
          "Calendrier en ligne pour votre essayage de perruque médicalisée.",
      },
    ],
  }),
  component: ReservationPage,
});


// ===== Slot helpers =====
const HOURS = [10, 11, 12, 13, 14, 15, 16, 17]; // créneaux toutes les heures pleines, 10h-17h (dernier RDV à 17h, fin 18h)

function isOpenDay(d: Date) {
  const day = d.getDay(); // 0=dim … 6=sam
  return day >= 2 && day <= 6; // mardi -> samedi
}

function toLocalDateStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildSlotDate(date: Date, hour: number) {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return d;
}

// ===== Form schema =====
const formSchema = z.object({
  fullName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  notes: z.string().trim().max(1000).optional(),
});
type FormValues = z.infer<typeof formSchema>;

function ReservationPage() {
  const fetchBusy = useServerFn(getBusySlots);
  const fetchClosed = useServerFn(getClosedDates);
  const submit = useServerFn(createBooking);
  const { modele } = Route.useSearch();
  const selectedProduct = useMemo(
    () => (modele ? getProductBySlug(modele) : undefined),
    [modele]
  );
  const prefilledNotes = selectedProduct
    ? `Modèle souhaité : ${selectedProduct.name} (${selectedProduct.length})`
    : "";



  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 45);
    return d;
  }, [today]);

  // Range to query : aujourd'hui → +45j
  const range = useMemo(
    () => ({ from: toLocalDateStr(today), to: toLocalDateStr(maxDate) }),
    [today, maxDate]
  );

  const { data: busyData } = useQuery({
    queryKey: ["busy-slots", range.from, range.to],
    queryFn: () => fetchBusy({ data: range }),
  });
  const { data: closedData } = useQuery({
    queryKey: ["closed-dates"],
    queryFn: () => fetchClosed(),
  });

  const busySet = useMemo(
    () => new Set((busyData?.busy ?? []).map((s) => new Date(s).getTime())),
    [busyData]
  );
  const closedSet = useMemo(
    () => new Set((closedData?.dates ?? []).map((d) => d.date)),
    [closedData]
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Date | undefined>(undefined);
  const [confirmed, setConfirmed] = useState<{
    start: Date;
    end: Date;
    fullName: string;
    email: string;
    phone: string;
    productName?: string;
  } | null>(null);


  const slotsForDay = useMemo(() => {
    if (!selectedDate) return [];
    return HOURS.map((h) => {
      const d = buildSlotDate(selectedDate, h);
      const isPast = d.getTime() < Date.now() + 60 * 60 * 1000;
      const isBusy = busySet.has(d.getTime());
      return { date: d, hour: h, disabled: isPast || isBusy, isBusy };
    });
  }, [selectedDate, busySet]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: prefilledNotes },
  });


  const onSubmit = async (values: FormValues) => {
    if (!selectedSlot) {
      toast.error("Choisissez un créneau avant d'envoyer.");
      return;
    }
    try {
      await submit({
        data: {
          slotStart: selectedSlot.toISOString(),
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          notes: values.notes || "",
        },
      });
      const end = new Date(selectedSlot.getTime() + 60 * 60 * 1000);
      setConfirmed({
        start: selectedSlot,
        end,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        productName: selectedProduct?.name,
      });
      reset();
    } catch (err) {
      toast.error("Réservation impossible", {
        description: err instanceof Error ? err.message : "Réessayez plus tard.",
      });
    }
  };


  const disabledDays = (d: Date) => {
    if (d < today) return true;
    if (d > maxDate) return true;
    if (!isOpenDay(d)) return true;
    if (closedSet.has(toLocalDateStr(d))) return true;
    return false;
  };

  if (confirmed) {
    const { start, end, fullName, email, phone, productName } = confirmed;
    const dateLabel = start.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeLabel = `${start.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })} – ${end.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    const location = "Hanny Tresse, Perpignan";
    const eventDescription =
      `Essayage perruque médicalisée chez Hanny Tresse.\n` +
      (productName ? `Modèle souhaité : ${productName}\n` : "") +
      `Client : ${fullName} (${email} · ${phone})\n` +
      `Demande à confirmer par le salon sous 24h ouvrées.`;
    const ev: CalendarEvent = {
      title: productName
        ? `Essayage perruque – ${productName} – Hanny Tresse`
        : "Essayage perruque médicalisée – Hanny Tresse",
      description: eventDescription,
      location,
      start,
      end,
    };

    return (
      <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 md:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-7 w-7" />
            </div>
            <h1 className="mt-5 font-serif text-3xl md:text-4xl">
              Demande enregistrée
            </h1>
            <p className="mt-3 text-muted-foreground">
              Nous vous recontactons sous 24h ouvrées pour confirmer votre
              rendez-vous. Un récapitulatif est disponible ci-dessous.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border">
            <div className="border-b border-border bg-secondary/40 px-5 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Récapitulatif
            </div>
            <dl className="divide-y divide-border text-sm">
              <div className="flex items-start gap-4 px-5 py-3">
                <dt className="w-28 flex-shrink-0 text-muted-foreground">
                  Prestation
                </dt>
                <dd className="font-medium">
                  Essayage perruque médicalisée (1h)
                </dd>
              </div>
              {productName && (
                <div className="flex items-start gap-4 px-5 py-3">
                  <dt className="w-28 flex-shrink-0 text-muted-foreground">
                    Modèle
                  </dt>
                  <dd className="font-medium">{productName}</dd>
                </div>
              )}
              <div className="flex items-start gap-4 px-5 py-3">
                <dt className="w-28 flex-shrink-0 text-muted-foreground">
                  Date
                </dt>
                <dd className="font-medium capitalize">{dateLabel}</dd>
              </div>
              <div className="flex items-start gap-4 px-5 py-3">
                <dt className="w-28 flex-shrink-0 text-muted-foreground">
                  Horaire
                </dt>
                <dd className="font-medium">{timeLabel}</dd>
              </div>
              <div className="flex items-start gap-4 px-5 py-3">
                <dt className="w-28 flex-shrink-0 text-muted-foreground">
                  Lieu
                </dt>
                <dd className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {location}
                </dd>
              </div>
              <div className="flex items-start gap-4 px-5 py-3">
                <dt className="w-28 flex-shrink-0 text-muted-foreground">
                  Client
                </dt>
                <dd>
                  <div className="font-medium">{fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {email} · {phone}
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-wider text-primary">
              Ajouter à votre agenda
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bloquez le créneau le temps que le salon confirme.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => downloadICS("rendez-vous-hanny-tresse.ics", ev)}
              >
                <Download className="mr-1 h-4 w-4" />
                Fichier .ics (Apple, Outlook…)
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a
                  href={googleCalendarUrl(ev)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarPlus className="mr-1 h-4 w-4" />
                  Google Agenda
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/perruques-medicalisees">Voir les perruques</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }



  return (
    <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <CalendarDays className="h-3 w-3 text-primary" /> Réservation en ligne
        </span>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl">
          Réservez votre essayage perruque médicalisée
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Choisissez un créneau d'1 heure, du mardi au samedi entre 10h et 18h.
          Votre demande est validée par le salon sous 24h ouvrées.
        </p>

        {selectedProduct && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
              loading="lazy"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
                <Sparkles className="h-3 w-3" /> Modèle pré-sélectionné
              </div>
              <p className="mt-1 font-serif text-lg">{selectedProduct.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedProduct.length} · {selectedProduct.hairType} · à partir
                de {selectedProduct.price} €
              </p>
            </div>
            <Link
              to="/perruques-medicalisees"
              className="text-xs text-muted-foreground underline hover:text-primary"
            >
              Changer
            </Link>
          </div>
        )}



        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Calendrier + créneaux */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg">1. Choisissez une date</h2>
            <div className="mt-3 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d ?? undefined);
                  setSelectedSlot(undefined);
                }}
                disabled={disabledDays}
                className={cn("p-0 pointer-events-auto")}
              />
            </div>

            {selectedDate && (
              <div className="mt-5 border-t border-border pt-5">
                <h3 className="font-serif text-base">
                  2. Choisissez un horaire
                </h3>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slotsForDay.map((s) => {
                    const active = selectedSlot?.getTime() === s.date.getTime();
                    return (
                      <button
                        key={s.hour}
                        type="button"
                        disabled={s.disabled}
                        onClick={() => setSelectedSlot(s.date)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition",
                          s.disabled &&
                            "cursor-not-allowed border-border bg-muted/40 text-muted-foreground line-through opacity-50",
                          !s.disabled &&
                            !active &&
                            "border-border bg-background hover:border-primary",
                          active &&
                            "border-primary bg-primary text-primary-foreground"
                        )}
                      >
                        {String(s.hour).padStart(2, "0")}:00
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Créneaux barrés = déjà réservés ou trop proches.
                </p>
              </div>
            )}
          </div>

          {/* Formulaire */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-3xl border border-border bg-card p-5"
            noValidate
          >
            <h2 className="font-serif text-lg">3. Vos coordonnées</h2>
            {selectedSlot ? (
              <p className="rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                Créneau sélectionné :{" "}
                <strong>
                  {selectedSlot.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  à{" "}
                  {selectedSlot.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>
              </p>
            ) : (
              <p className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
                Sélectionnez d'abord une date et un horaire.
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input id="fullName" {...register("fullName")} aria-invalid={!!errors.fullName} />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Message (optionnel)</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Centre d'oncologie, type de traitement, questions…"
                {...register("notes")}
              />
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                Vos informations sont confidentielles et utilisées uniquement
                pour organiser votre essayage.
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !selectedSlot}
            >
              {isSubmitting ? "Envoi…" : "Confirmer la réservation"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

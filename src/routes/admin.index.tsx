import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  listSubmissions,
  updateSubmissionStatus,
  updateBookingStatus,
  addClosedDate,
  removeClosedDate,
  checkIsAdmin,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Hanny Tresse" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

type Status = "new" | "read" | "handled";
const statusLabel: Record<Status, string> = {
  new: "Nouveau",
  read: "Lu",
  handled: "Traité",
};

function StatusBadge({ status }: { status: Status }) {
  const variant =
    status === "new" ? "default" : status === "read" ? "secondary" : "outline";
  return <Badge variant={variant as "default" | "secondary" | "outline"}>{statusLabel[status]}</Badge>;
}

type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "completed";
const bookingStatusLabel: Record<BookingStatus, string> = {
  pending_payment: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const variant =
    status === "confirmed"
      ? "default"
      : status === "pending_payment"
      ? "secondary"
      : status === "completed"
      ? "outline"
      : "destructive";
  return (
    <Badge variant={variant as "default" | "secondary" | "outline" | "destructive"}>
      {bookingStatusLabel[status]}
    </Badge>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtSlot(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const checkAdmin = useServerFn(checkIsAdmin);
  const fetchList = useServerFn(listSubmissions);
  const updateStatus = useServerFn(updateSubmissionStatus);
  const updateBooking = useServerFn(updateBookingStatus);
  const addClosed = useServerFn(addClosedDate);
  const removeClosed = useServerFn(removeClosedDate);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const res = await checkAdmin();
        if (!res.isAdmin) {
          toast.error("Accès refusé", { description: "Ce compte n'a pas les droits administrateur." });
          await supabase.auth.signOut();
          navigate({ to: "/admin/login" });
          return;
        }
        setReady(true);
      } catch {
        navigate({ to: "/admin/login" });
      }
    });
    return () => {
      mounted = false;
    };
  }, [navigate, checkAdmin]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: () => fetchList(),
    enabled: ready,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });

  const onUpdateStatus = async (
    table: "contact_messages" | "appointment_requests" | "product_inquiries",
    id: string,
    status: Status
  ) => {
    try {
      await updateStatus({ data: { table, id, status } });
      invalidate();
    } catch (err) {
      toast.error("Erreur", { description: err instanceof Error ? err.message : "" });
    }
  };

  const onUpdateBooking = async (id: string, status: BookingStatus) => {
    try {
      await updateBooking({ data: { id, status } });
      toast.success("Réservation mise à jour");
      invalidate();
    } catch (err) {
      toast.error("Erreur", { description: err instanceof Error ? err.message : "" });
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (!ready) {
    return (
      <section className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Chargement…
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Espace salon</p>
          <h1 className="mt-2 font-serif text-3xl">Tableau de bord</h1>
        </div>
        <Button variant="outline" onClick={onLogout}>Se déconnecter</Button>
      </div>

      {isLoading || !data ? (
        <p className="mt-10 text-muted-foreground">Chargement des demandes…</p>
      ) : (
        <Tabs defaultValue="bookings" className="mt-8">
          <TabsList className="flex-wrap">
            <TabsTrigger value="bookings">
              Réservations ({data.bookings.length})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              Demandes perruques ({data.appointments.length})
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              Boutique ({data.inquiries.length})
            </TabsTrigger>
            <TabsTrigger value="contacts">
              Contact ({data.contacts.length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Jours fermés ({data.closedDates.length})
            </TabsTrigger>
          </TabsList>

          {/* Réservations */}
          <TabsContent value="bookings" className="mt-6 space-y-3">
            {data.bookings.length === 0 && <Empty />}
            {data.bookings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {fmtSlot(b.slot_start as string)} — {b.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.email} · {b.phone} · demande reçue le {fmtDate(b.created_at as string)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookingStatusBadge status={b.status as BookingStatus} />
                    <Select
                      value={b.status as BookingStatus}
                      onValueChange={(v) => onUpdateBooking(b.id as string, v as BookingStatus)}
                    >
                      <SelectTrigger className="h-8 w-[140px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending_payment">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmé</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {b.notes && (
                  <p className="mt-3 whitespace-pre-wrap rounded-lg bg-secondary/40 p-3 text-sm">
                    {b.notes as string}
                  </p>
                )}
              </div>
            ))}
          </TabsContent>

          {/* Demandes perruques (anciennes) */}
          <TabsContent value="appointments" className="mt-6 space-y-3">
            {data.appointments.length === 0 && <Empty />}
            {data.appointments.map((r) => (
              <Card
                key={r.id}
                title={r.full_name}
                subtitle={`${fmtDate(r.created_at)} · ${r.email} · ${r.phone}`}
                status={r.status as Status}
                onStatusChange={(s) => onUpdateStatus("appointment_requests", r.id, s)}
              >
                <p className="text-sm">{r.situation}</p>
                {r.oncology_center && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Centre : {r.oncology_center}
                  </p>
                )}
                {r.preferred_slot && (
                  <p className="text-xs text-muted-foreground">Créneau : {r.preferred_slot}</p>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="inquiries" className="mt-6 space-y-3">
            {data.inquiries.length === 0 && <Empty />}
            {data.inquiries.map((r) => (
              <Card
                key={r.id}
                title={`${r.product_name} — ${r.full_name}`}
                subtitle={`${fmtDate(r.created_at)} · ${r.email} · ${r.phone}`}
                status={r.status as Status}
                onStatusChange={(s) => onUpdateStatus("product_inquiries", r.id, s)}
              >
                {r.message && <p className="text-sm">{r.message}</p>}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="contacts" className="mt-6 space-y-3">
            {data.contacts.length === 0 && <Empty />}
            {data.contacts.map((r) => (
              <Card
                key={r.id}
                title={`${r.full_name}${r.subject ? ` — ${r.subject}` : ""}`}
                subtitle={`${fmtDate(r.created_at)} · ${r.email}${r.phone ? ` · ${r.phone}` : ""}`}
                status={r.status as Status}
                onStatusChange={(s) => onUpdateStatus("contact_messages", r.id, s)}
              >
                <p className="text-sm whitespace-pre-wrap">{r.message}</p>
              </Card>
            ))}
          </TabsContent>

          {/* Jours fermés */}
          <TabsContent value="closed" className="mt-6">
            <ClosedDatesManager
              dates={data.closedDates}
              onAdd={async (date, reason) => {
                try {
                  await addClosed({ data: { date, reason } });
                  toast.success("Jour fermé ajouté");
                  invalidate();
                } catch (err) {
                  toast.error("Erreur", {
                    description: err instanceof Error ? err.message : "",
                  });
                }
              }}
              onRemove={async (id) => {
                try {
                  await removeClosed({ data: { id } });
                  toast.success("Jour fermé supprimé");
                  invalidate();
                } catch (err) {
                  toast.error("Erreur", {
                    description: err instanceof Error ? err.message : "",
                  });
                }
              }}
            />
          </TabsContent>
        </Tabs>
      )}
    </section>
  );
}

function Empty() {
  return (
    <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
      Aucune demande pour le moment.
    </p>
  );
}

function Card({
  title,
  subtitle,
  status,
  onStatusChange,
  children,
}: {
  title: string;
  subtitle: string;
  status: Status;
  onStatusChange: (s: Status) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <Select value={status} onValueChange={(v) => onStatusChange(v as Status)}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="read">Lu</SelectItem>
              <SelectItem value="handled">Traité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ClosedDatesManager({
  dates,
  onAdd,
  onRemove,
}: {
  dates: Array<{ id: string; date: string; reason: string | null }>;
  onAdd: (date: string, reason: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    setBusy(true);
    await onAdd(date, reason);
    setBusy(false);
    setDate("");
    setReason("");
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={submit}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Date à fermer</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[180px]"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Raison (optionnel)</label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Congés, formation…"
            className="w-[260px]"
          />
        </div>
        <Button type="submit" disabled={busy || !date}>
          Ajouter
        </Button>
      </form>

      {dates.length === 0 ? (
        <Empty />
      ) : (
        <div className="space-y-2">
          {dates.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {new Date(d.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {d.reason && (
                  <p className="text-xs text-muted-foreground">{d.reason}</p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemove(d.id)}>
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

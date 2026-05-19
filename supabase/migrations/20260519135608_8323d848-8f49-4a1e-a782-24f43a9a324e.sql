
CREATE TYPE public.booking_status AS ENUM ('pending_payment', 'confirmed', 'cancelled', 'completed');

CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  status public.booking_status NOT NULL DEFAULT 'pending_payment',
  stripe_session_id TEXT,
  deposit_amount_cents INTEGER NOT NULL DEFAULT 3000,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_slot_start ON public.bookings(slot_start);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_stripe_session ON public.bookings(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- Empêche deux réservations confirmées sur le même créneau (le pending est vérifié en applicatif)
CREATE UNIQUE INDEX uniq_confirmed_slot ON public.bookings(slot_start)
  WHERE status = 'confirmed';

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.closed_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.closed_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view closed dates"
  ON public.closed_dates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert closed dates"
  ON public.closed_dates FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update closed dates"
  ON public.closed_dates FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete closed dates"
  ON public.closed_dates FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Retourne uniquement les créneaux occupés (sans PII) pour calculer les dispos côté front
CREATE OR REPLACE FUNCTION public.get_busy_slots(from_date DATE, to_date DATE)
RETURNS TABLE(slot_start TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.slot_start
  FROM public.bookings b
  WHERE b.slot_start >= from_date::timestamptz
    AND b.slot_start < (to_date + INTERVAL '1 day')::timestamptz
    AND (
      b.status = 'confirmed'
      OR (b.status = 'pending_payment' AND b.expires_at > now())
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_busy_slots(DATE, DATE) TO anon, authenticated;


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
      OR (b.status = 'pending_payment' AND (b.expires_at IS NULL OR b.expires_at > now()))
    );
$$;

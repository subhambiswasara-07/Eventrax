import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventById } from '../../api/eventApi';
import { bookEvent, sendBookingOtp } from '../../api/bookingApi';
import { formatDate, formatPrice, isPastDate } from '../../utils/formatters';
import { isValidOtp } from '../../utils/validators';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { Loader, ErrorState } from '../../components/States';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  const loadEvent = async () => {
    setStatus('loading');
    try {
      const data = await getEventById(id);
      setEvent(data);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Could not load this event');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const startReservation = async () => {
    setSendingOtp(true);
    setOtpError('');
    try {
      await sendBookingOtp();
      setOtpSentNotice('Code sent — check your inbox.');
      setShowOtpModal(true);
    } catch (err) {
      setOtpError(err.message || 'Could not send a code right now');
      setShowOtpModal(true);
    } finally {
      setSendingOtp(false);
    }
  };

  const confirmReservation = async (e) => {
    e.preventDefault();
    if (!isValidOtp(otp)) {
      setOtpError('Enter the 6-digit code from your email');
      return;
    }
    setSubmittingBooking(true);
    setOtpError('');
    try {
      const data = await bookEvent(id, otp);
      setBookingResult(data.booking);
      setShowOtpModal(false);
      setOtp('');
    } catch (err) {
      setOtpError(err.message || 'That code didn\u2019t work');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (status === 'loading') return <Loader label="Loading event" />;
  if (status === 'error') return <ErrorState message={errorMessage} onRetry={loadEvent} />;
  if (!event) return null;

  const soldOut = event.availableSeats <= 0;
  const past = isPastDate(event.date);
  const canReserve = !soldOut && !past && !bookingResult;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 font-body text-sm font-semibold text-ink/60 hover:text-ink"
      >
        ← Back
      </button>

      <div className="overflow-hidden rounded-2xl border-2 border-ink shadow-stub">
        <img src={event.imageUrl} alt={event.title} className="h-64 w-full object-cover sm:h-80" />
        <div className="bg-chalk p-8">
          <p className="font-body text-sm font-bold uppercase tracking-wide text-flare">
            {formatDate(event.date)}
          </p>
          <h1 className="mt-1 font-display text-4xl text-ink">{event.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="border-ink/30 text-ink/70">{event.location}</Badge>
            <Badge className={soldOut ? 'border-ink bg-ink text-chalk' : 'border-electric text-electric'}>
              {soldOut ? 'Sold out' : `${event.availableSeats}/${event.totalSeats} seats left`}
            </Badge>
            {past && <Badge className="border-ink/30 text-ink/50">Past event</Badge>}
          </div>

          <p className="mt-6 whitespace-pre-line font-body text-ink/70">{event.description}</p>

          <div className="mt-8 flex flex-col gap-4 border-t-2 border-dashed border-ink/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-display text-3xl text-ink">{formatPrice(event.price)}</span>

            {bookingResult ? (
              <div className="rounded-xl border-2 border-electric bg-electric/10 px-5 py-3 font-body text-sm font-semibold text-electric">
                Reservation {bookingResult.status} — we&apos;ll email you once the organizer confirms
                it.
              </div>
            ) : (
              <Button
                variant="primary"
                disabled={!canReserve}
                loading={sendingOtp}
                onClick={startReservation}
              >
                {soldOut ? 'Sold out' : past ? 'Event has passed' : 'Reserve my seat'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showOtpModal && (
        <Modal title="Enter your code" onClose={() => setShowOtpModal(false)}>
          <p className="mb-4 font-body text-sm text-ink/60">
            {otpSentNotice || 'Enter the 6-digit code we emailed you to lock in this seat.'}
          </p>
          <form onSubmit={confirmReservation} className="flex flex-col gap-4">
            <Input
              label="6-digit code"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              error={otpError}
            />
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={startReservation}
                loading={sendingOtp}
                className="!px-4 !py-2 text-sm"
              >
                Resend code
              </Button>
              <Button type="submit" variant="primary" full loading={submittingBooking}>
                Confirm reservation
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelBooking, getMyBookings } from '../../api/bookingApi';
import { formatDate, formatPrice } from '../../utils/formatters';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_STYLES } from '../../utils/constants';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Loader, EmptyState, ErrorState } from '../../components/States';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const loadBookings = async () => {
    setStatus('loading');
    try {
      const data = await getMyBookings();
      setBookings(Array.isArray(data) ? data : []);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Could not load your tickets');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      setErrorMessage(err.message || 'Could not cancel that booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">MY TICKETS</h1>
      <p className="mt-2 font-body text-ink/60">Everything you&apos;ve reserved, in one stack.</p>

      <div className="mt-8">
        {status === 'loading' && <Loader label="Fetching your tickets" />}
        {status === 'error' && <ErrorState message={errorMessage} onRetry={loadBookings} />}
        {status === 'success' && bookings.length === 0 && (
          <EmptyState
            title="No tickets yet"
            description="Reserve a seat at an event and it'll show up here."
            action={
              <Link to="/events">
                <Button variant="primary" className="mt-2">
                  Browse events
                </Button>
              </Link>
            }
          />
        )}

        {status === 'success' && bookings.length > 0 && (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="ticket-stub flex flex-col gap-4 rounded-2xl p-6 shadow-stub sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-wide text-flare">
                    {booking.eventId?.date ? formatDate(booking.eventId.date) : ''}
                  </p>
                  <h3 className="font-display text-xl text-ink">
                    {booking.eventId?.title || 'Event unavailable'}
                  </h3>
                  <p className="font-body text-sm text-ink/60">
                    {booking.eventId?.location} &middot; {formatPrice(booking.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={BOOKING_STATUS_STYLES[booking.status] || 'text-ink/60'}>
                    {BOOKING_STATUS_LABELS[booking.status] || booking.status}
                  </Badge>
                  {booking.status !== 'cancelled' && (
                    <Button
                      variant="danger"
                      className="!px-4 !py-2 text-sm"
                      loading={cancellingId === booking._id}
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

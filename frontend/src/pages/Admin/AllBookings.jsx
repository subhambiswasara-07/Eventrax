
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { confirmBooking, getAllBookings } from '../../api/bookingApi';
import Button from '../../components/Button';
import { Loader } from '../../components/States';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from '../../utils/constants';

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusClass = (status) => {
  return (
    BOOKING_STATUS_STYLES[status] ||
    'bg-white text-ink border border-ink/10'
  );
};

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadBookings = async () => {
    setError('');

    try {
      const data = await getAllBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const user = booking.userId;
      const event = booking.eventId;

      const matchesStatus =
        statusFilter === 'all' || booking.status === statusFilter;

      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        user?.username?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        event?.title?.toLowerCase().includes(query) ||
        booking.status?.toLowerCase().includes(query) ||
        booking.paymentStatus?.toLowerCase().includes(query)
      );
    });
  }, [bookings, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((item) => item.status === 'pending').length,
      confirmed: bookings.filter((item) => item.status === 'confirmed').length,
      cancelled: bookings.filter((item) => item.status === 'cancelled').length,
    };
  }, [bookings]);

  const handleConfirm = async (bookingId) => {
    const shouldConfirm = window.confirm(
      'Are you sure you want to confirm this booking?'
    );

    if (!shouldConfirm) return;

    setConfirmingId(bookingId);
    setActionError('');

    try {
      const result = await confirmBooking(bookingId);

      /*
       * Replace the changed booking locally so the page
       * updates immediately without another full refresh.
       */
      if (result?.booking) {
        setBookings((current) =>
          current.map((booking) =>
            booking._id === bookingId ? result.booking : booking
          )
        );
      } else {
        await loadBookings();
      }
    } catch (err) {
      setActionError(err.message || 'Could not confirm booking');
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) {
    return <Loader label="Loading bookings" />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-chalk">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-5 border-b-2 border-ink pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-[0.2em] text-flare">
              Admin / Bookings
            </p>

            <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-ink sm:text-5xl">
              All Bookings
            </h1>

            <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-ink/60">
              View every customer booking and confirm pending reservations
              from one place.
            </p>
          </div>

          <Link
            to="/admin/events/new"
            className="inline-flex items-center justify-center rounded-xl border-2 border-ink bg-white px-5 py-3 font-body text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-paper"
          >
            Create Event
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border-2 border-flare bg-flare/10 px-4 py-3 font-body text-sm font-semibold text-flare">
            {error}
          </div>
        )}

        {/* Action error */}
        {actionError && (
          <div className="mt-4 rounded-xl border-2 border-flare bg-flare/10 px-4 py-3 font-body text-sm font-semibold text-flare">
            {actionError}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border-2 border-ink bg-white p-5 shadow-stub-sm">
            <p className="font-body text-xs font-bold uppercase tracking-wider text-ink/50">
              Total
            </p>
            <p className="mt-2 font-display text-3xl text-ink">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-sunbeam p-5 shadow-stub-sm">
            <p className="font-body text-xs font-bold uppercase tracking-wider text-ink/50">
              Pending
            </p>
            <p className="mt-2 font-display text-3xl text-ink">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-electric p-5 shadow-stub-sm">
            <p className="font-body text-xs font-bold uppercase tracking-wider text-chalk/80">
              Confirmed
            </p>
            <p className="mt-2 font-display text-3xl text-chalk">
              {stats.confirmed}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-ink p-5 shadow-stub-sm">
            <p className="font-body text-xs font-bold uppercase tracking-wider text-chalk/60">
              Cancelled
            </p>
            <p className="mt-2 font-display text-3xl text-chalk">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border-2 border-ink bg-paper p-4 md:flex-row">
          <input
            type="search"
            placeholder="Search customer, email or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border-2 border-ink/15 bg-white px-4 py-3 font-body text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-flare"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border-2 border-ink/15 bg-white px-4 py-3 font-body text-sm font-semibold text-ink outline-none focus:border-flare"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-stub-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="border-b-2 border-ink bg-paper">
                  <th className="px-5 py-4 text-left font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Event
                  </th>

                  <th className="px-5 py-4 text-left font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-left font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-body text-xs font-bold uppercase tracking-wider text-ink/60">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => {
                  const user = booking.userId;
                  const event = booking.eventId;

                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-ink/10 last:border-0 hover:bg-paper/50"
                    >
                      <td className="px-5 py-5">
                        <p className="font-body text-sm font-bold text-ink">
                          {user?.username || 'Unknown user'}
                        </p>
                        <p className="mt-1 font-body text-xs text-ink/50">
                          {user?.email || 'No email'}
                        </p>
                      </td>

                      <td className="max-w-[250px] px-5 py-5">
                        <p className="truncate font-body text-sm font-bold text-ink">
                          {event?.title || 'Unknown event'}
                        </p>

                        <p className="mt-1 truncate font-body text-xs text-ink/50">
                          {event?.location || 'Location unavailable'}
                        </p>
                      </td>

                      <td className="px-5 py-5 font-body text-sm text-ink/70">
                        {formatDate(event?.date)}
                      </td>

                      <td className="px-5 py-5 font-body text-sm font-bold text-ink">
                        ₹{Number(booking.amount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="px-5 py-5">
                        <span className="font-body text-xs font-bold uppercase text-ink/60">
                          {booking.paymentStatus || 'unpaid'}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 font-body text-xs font-bold ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {BOOKING_STATUS_LABELS[booking.status] ||
                            booking.status}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-right">
                        {booking.status === 'pending' ? (
                          <Button
                            variant="primary"
                            loading={confirmingId === booking._id}
                            onClick={() => handleConfirm(booking._id)}
                            className="!px-4 !py-2"
                          >
                            Confirm
                          </Button>
                        ) : (
                          <span className="font-body text-xs font-semibold text-ink/40">
                            No action
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 flex flex-col gap-4 lg:hidden">
          {filteredBookings.map((booking) => {
            const user = booking.userId;
            const event = booking.eventId;

            return (
              <div
                key={booking._id}
                className="rounded-2xl border-2 border-ink bg-white p-5 shadow-stub-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-body text-base font-bold text-ink">
                      {event?.title || 'Unknown event'}
                    </p>

                    <p className="mt-1 font-body text-xs text-ink/50">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 font-body text-xs font-bold ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {BOOKING_STATUS_LABELS[booking.status] ||
                      booking.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-y border-ink/10 py-4">
                  <div>
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-ink/40">
                      Customer
                    </p>

                    <p className="mt-1 font-body text-sm font-bold text-ink">
                      {user?.username || 'Unknown'}
                    </p>

                    <p className="mt-0.5 break-all font-body text-xs text-ink/50">
                      {user?.email || 'No email'}
                    </p>
                  </div>

                  <div>
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-ink/40">
                      Amount
                    </p>

                    <p className="mt-1 font-body text-sm font-bold text-ink">
                      ₹{Number(booking.amount || 0).toLocaleString('en-IN')}
                    </p>

                    <p className="mt-0.5 font-body text-xs capitalize text-ink/50">
                      Payment: {booking.paymentStatus || 'unpaid'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-body text-xs text-ink/50">
                    {event?.location || 'Location unavailable'}
                  </p>

                  <p className="mt-1 font-body text-xs text-ink/50">
                    Event: {formatDate(event?.date)}
                  </p>
                </div>

                {booking.status === 'pending' && (
                  <Button
                    full
                    variant="primary"
                    loading={confirmingId === booking._id}
                    onClick={() => handleConfirm(booking._id)}
                    className="mt-5"
                  >
                    Confirm Booking
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredBookings.length === 0 && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-ink/20 bg-paper px-6 py-16 text-center">
            <h2 className="font-display text-2xl uppercase text-ink">
              No bookings found
            </h2>

            <p className="mx-auto mt-2 max-w-md font-body text-sm text-ink/50">
              Try changing the search text or status filter.
            </p>
          </div>
        )}

        {/* Result count */}
        {filteredBookings.length > 0 && (
          <p className="mt-4 text-right font-body text-xs font-semibold text-ink/40">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        )}
      </div>
    </div>
  );
}

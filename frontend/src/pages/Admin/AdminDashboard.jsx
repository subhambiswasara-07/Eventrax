
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteEvent, getAllEvents } from '../../api/eventApi';
import { formatDate, formatPrice } from '../../utils/formatters';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Loader, EmptyState, ErrorState } from '../../components/States';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadEvents = async () => {
    setStatus('loading');

    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Could not load events');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;

    setDeletingId(id);

    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (err) {
      setErrorMessage(err.message || 'Could not delete this event');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Admin Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-ink">
            ADMIN DASHBOARD
          </h1>

          <p className="mt-1 font-body text-ink/60">
            Manage events and bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/events/new">
            <Button variant="primary">
              + New event
            </Button>
          </Link>

          <Link to="/admin/bookings">
            <Button variant="outline">
              All Bookings
            </Button>
          </Link>
        </div>
      </div>

      {/* Events */}
      <section className="mt-10">
        <h2 className="font-display text-xl text-ink">
          Events
        </h2>

        <div className="mt-4">
          {status === 'loading' && (
            <Loader label="Loading events" />
          )}

          {status === 'error' && (
            <ErrorState
              message={errorMessage}
              onRetry={loadEvents}
            />
          )}

          {status === 'success' && events.length === 0 && (
            <EmptyState
              title="No events yet"
              description="Create your first event to get started."
            />
          )}

          {status === 'success' && events.length > 0 && (
            <div className="flex flex-col gap-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col gap-3 rounded-2xl border-2 border-ink bg-chalk p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-body text-xs font-bold uppercase tracking-wide text-flare">
                      {formatDate(event.date)}
                    </p>

                    <h3 className="font-display text-lg text-ink">
                      {event.title}
                    </h3>

                    <p className="font-body text-sm text-ink/60">
                      {event.location} &middot; {formatPrice(event.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className="border-electric text-electric">
                      {event.availableSeats}/{event.totalSeats} left
                    </Badge>

                    <Link to={`/admin/events/${event._id}/edit`}>
                      <Button
                        variant="outline"
                        className="!px-4 !py-2 text-sm"
                      >
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="danger"
                      className="!px-4 !py-2 text-sm"
                      loading={deletingId === event._id}
                      onClick={() =>
                        handleDelete(event._id, event.title)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
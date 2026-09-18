import { useEffect, useMemo, useState } from 'react';
import { getAllEvents } from '../../api/eventApi';
import { isPastDate } from '../../utils/formatters';
import EventCard from '../../components/EventCard';
import { Loader, EmptyState, ErrorState } from '../../components/States';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('upcoming'); // upcoming | past | all

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

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (filter === 'upcoming') return !isPastDate(event.date);
        if (filter === 'past') return isPastDate(event.date);
        return true;
      })
      .filter((event) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
          event.title?.toLowerCase().includes(term) || event.location?.toLowerCase().includes(term)
        );
      });
  }, [events, search, filter]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-flare">Explore</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">Find your next experience.</h1>
        <p className="mt-2 max-w-xl text-base leading-7 text-ink/55">Browse what&apos;s open, compare availability, then reserve before seats run out.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search by title or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink shadow-sm focus:border-flare/40 focus:outline-none focus:ring-4 focus:ring-flare/10 sm:w-80"
        />
        <div className="flex gap-2">
          {['upcoming', 'past', 'all'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize transition-all ${
                filter === option ? 'border-ink bg-ink text-white shadow-sm' : 'border-ink/10 bg-white text-ink/60 hover:border-ink/20 hover:text-ink'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {status === 'loading' && <Loader label="Fetching events" />}
        {status === 'error' && (
          <ErrorState message={errorMessage} onRetry={loadEvents} />
        )}
        {status === 'success' && filteredEvents.length === 0 && (
          <EmptyState
            title="No events match that"
            description="Try a different search term or switch filters."
          />
        )}
        {status === 'success' && filteredEvents.length > 0 && (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

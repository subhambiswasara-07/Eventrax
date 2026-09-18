import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../utils/formatters';
import Badge from './Badge';

export default function EventCard({ event }) {
  const soldOut = event.availableSeats <= 0;
  return (
    <Link to={`/events/${event._id}`} className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-stub">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-paper sm:h-auto sm:w-56">
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => { e.currentTarget.src='data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23EEF2FF"/></svg>'; }} />
          {soldOut && <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-xs font-bold tracking-[.16em] text-white backdrop-blur-sm">SOLD OUT</span>}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[.12em] text-flare">{formatDate(event.date)}</p>
              <span className="text-lg font-bold text-ink">{formatPrice(event.price)}</span>
            </div>
            <h3 className="mt-2 text-xl font-bold tracking-tight group-hover:text-flare">{event.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/55">{event.description}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className="border-ink/10 bg-paper/60 text-ink/60">{event.location}</Badge>
            <Badge className={soldOut ? 'border-ink bg-ink text-white' : 'border-electric/20 bg-electric/5 text-electric'}>
              {soldOut ? '0 seats' : `${event.availableSeats} left`}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}

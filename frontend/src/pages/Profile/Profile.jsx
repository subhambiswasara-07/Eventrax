import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/Badge';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">MY PROFILE</h1>

      <div className="ticket-stub mt-8 rounded-2xl p-8 shadow-stub">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-sunbeam font-display text-2xl text-ink">
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">{user?.username}</h2>
            <p className="font-body text-sm text-ink/60">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge className={user?.role === 'admin' ? 'border-flare text-flare' : 'border-electric text-electric'}>
            {user?.role === 'admin' ? 'Admin' : 'Attendee'}
          </Badge>
          <Badge className="border-ink/30 text-ink/60">Verified account</Badge>
        </div>

        <p className="mt-6 rounded-xl bg-paper px-4 py-3 font-body text-sm text-ink/60">
          Profile editing isn&apos;t available yet — the API doesn&apos;t expose an update-profile
          endpoint. Reach out to an admin if any of this needs to change.
        </p>
      </div>
    </div>
  );
}

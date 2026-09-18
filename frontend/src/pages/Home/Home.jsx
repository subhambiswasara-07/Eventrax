import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const steps = [
    { step: '01', title: 'Discover', copy: 'Find an event that fits your plans and explore the details in seconds.' },
    { step: '02', title: 'Verify', copy: 'Confirm your email with a secure one-time code before your seat is locked.' },
    { step: '03', title: 'Arrive', copy: 'Show up with a confirmed reservation while the organizer keeps everything in sync.' },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink/10 bg-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-flare/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-electric/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pb-28 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/70 px-3.5 py-2 text-xs font-semibold text-ink/70 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-electric" />
              Live events · real-time availability
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.055em] text-ink sm:text-6xl lg:text-7xl">
              Your next great
              <span className="block text-flare">experience starts here.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/60 sm:text-lg">
              Discover events, reserve a seat, verify in seconds, and arrive with confidence.
              EventraX makes the entire journey feel effortless.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Link to="/events"><Button className="!px-6 !py-3.5">Explore events <span aria-hidden>→</span></Button></Link>
              ) : (
                <>
                  <Link to="/signup"><Button className="!px-6 !py-3.5">Create free account <span aria-hidden>→</span></Button></Link>
                  <Link to="/login"><Button variant="outline" className="!px-6 !py-3.5">Log in</Button></Link>
                </>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-ink/45">
              <span>✓ Secure verification</span><span>✓ Live seat counts</span><span>✓ Simple reservations</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-ink/10 bg-ink p-3 shadow-2xl shadow-ink/15">
              <div className="rounded-[22px] bg-white p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-semibold uppercase tracking-[.12em] text-ink/40">Featured experience</p><p className="mt-1 text-lg font-bold">A night worth remembering</p></div>
                  <span className="rounded-full bg-sunbeam px-3 py-1 text-xs font-bold text-ink">Live</span>
                </div>
                <div className="mt-6 h-40 rounded-2xl bg-gradient-to-br from-paper via-white to-sunbeam/60 p-5">
                  <div className="flex h-full items-end"><div><p className="text-xs font-semibold text-ink/45">EVENTRAX</p><p className="mt-1 text-2xl font-bold tracking-tight">Moments, made easy.</p></div></div>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div><p className="text-xs text-ink/40">Availability</p><p className="mt-1 font-bold text-electric">24 seats left</p></div>
                  <span className="text-2xl font-bold">$49</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-flare">Simple by design</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to get through the door.</h2><p className="mt-3 text-ink/55">A focused booking flow without unnecessary friction.</p></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="ticket-stub p-6 transition-transform duration-200 hover:-translate-y-1">
              <span className="text-sm font-bold text-flare">{item.step}</span>
              <h3 className="mt-8 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/55">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-6 overflow-hidden rounded-3xl bg-ink sm:mx-6">
        <div className="mx-auto max-w-6xl px-6 py-14 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/45">Ready when you are</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Good events fill up. Your next seat is one click away.</h2>
          {!isAuthenticated && <Link to="/signup" className="mt-7 inline-block"><Button variant="secondary" className="!px-7 !py-3.5">Get started</Button></Link>}
        </div>
      </section>
    </div>
  );
}

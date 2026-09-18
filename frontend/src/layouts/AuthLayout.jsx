import { Link, Outlet } from 'react-router-dom';
import Logo from '../components/Logo';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-flare/25 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-electric/20 blur-3xl" />
        <div className="relative z-10"><Link to="/"><Logo dark /></Link></div>
        <div className="relative z-10 max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-white/45">EventraX</p>
          <h2 className="mt-4 text-5xl font-bold leading-[1.02] tracking-[-.05em]">Make plans.<br /><span className="text-sunbeam">Keep the moment.</span></h2>
          <p className="mt-5 max-w-md leading-7 text-white/55">A simpler way to discover experiences, reserve your place, and keep every ticket organized.</p>
        </div>
        <p className="relative z-10 text-xs text-white/30">Secure booking · effortless experiences</p>
      </div>
      <div className="flex items-center justify-center bg-[#f7f8fc] px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex justify-center lg:hidden"><Logo /></Link>
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-xl shadow-ink/5 sm:p-8"><Outlet /></div>
        </div>
      </div>
    </div>
  );
}

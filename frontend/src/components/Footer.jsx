import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo />
        <p className="text-xs text-ink/40">&copy; {new Date().getFullYear()} EventraX. Built for better plans.</p>
      </div>
    </footer>
  );
}

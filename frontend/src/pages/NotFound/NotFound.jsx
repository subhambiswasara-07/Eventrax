import { Link } from 'react-router-dom';
import Button from '../../components/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-display text-8xl text-sunbeam" style={{ WebkitTextStroke: '2px #1F1B24' }}>
        404
      </span>
      <h1 className="font-display text-2xl text-ink">THIS SEAT DOESN&apos;T EXIST</h1>
      <p className="font-body text-ink/60">The page you&apos;re looking for was never on the map.</p>
      <Link to="/">
        <Button variant="primary">Back to home</Button>
      </Link>
    </div>
  );
}

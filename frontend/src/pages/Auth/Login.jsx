import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail } from '../../utils/validators';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address';
    if (!form.password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/events';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.status === 403) {
        // Backend has already emailed a fresh OTP for this unverified account.
        navigate('/verify-otp', { state: { email: form.email, fromLogin: true } });
        return;
      }
      setFormError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">WELCOME BACK</h1>
      <p className="mt-2 font-body text-sm text-ink/60">Log in to reserve your next seat.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        {formError && (
          <div className="rounded-xl border-2 border-flare bg-flare/10 px-4 py-3 font-body text-sm font-medium text-flare">
            {formError}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 font-body text-sm text-ink/70">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-flare"
            />
            Remember me
          </label>
        </div>

        <Button type="submit" variant="primary" full loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-ink/60">
        New to EventraX?{' '}
        <Link to="/signup" className="font-semibold text-flare hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

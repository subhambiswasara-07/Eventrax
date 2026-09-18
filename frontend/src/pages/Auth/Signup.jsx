import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidPassword, passwordStrength } from '../../utils/validators';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(form.password);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = 'Username is required';
    if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address';
    if (!isValidPassword(form.password)) nextErrors.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) nextErrors.terms = 'You need to accept the terms to continue';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/verify-otp', { state: { email: form.email.trim(), fromSignup: true } });
    } catch (err) {
      setFormError(err.message || 'Could not create your account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">CLAIM YOUR SPOT</h1>
      <p className="mt-2 font-body text-sm text-ink/60">Create an account to start booking events.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        {formError && (
          <div className="rounded-xl border-2 border-flare bg-flare/10 px-4 py-3 font-body text-sm font-medium text-flare">
            {formError}
          </div>
        )}

        <Input
          label="Username"
          autoComplete="username"
          placeholder="alexrivera"
          value={form.username}
          onChange={handleChange('username')}
          error={errors.username}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
          />
          {form.password && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div
                  className={`h-full rounded-full transition-all ${strength.color}`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
              <p className="mt-1 font-body text-xs font-semibold text-ink/50">{strength.label} password</p>
            </div>
          )}
        </div>
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
        />

        <label className="flex items-start gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              setErrors((prev) => ({ ...prev, terms: undefined }));
            }}
            className="mt-0.5 h-4 w-4 accent-flare"
          />
          <span>
            I agree to the EventraX terms of service and understand my seat is only confirmed after
            verification.
          </span>
        </label>
        {errors.terms && <p className="-mt-2 font-body text-sm font-medium text-flare">{errors.terms}</p>}

        <Button type="submit" variant="primary" full loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-flare hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

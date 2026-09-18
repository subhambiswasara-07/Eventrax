import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidEmail, isValidOtp } from '../../utils/validators';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function VerifyOtp() {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const contextMessage = location.state?.fromLogin
    ? 'Your email isn\u2019t verified yet, so we just emailed you a fresh 6-digit code.'
    : 'We emailed a 6-digit code to confirm your address.';

  const validate = () => {
    const nextErrors = {};
    if (!isValidEmail(email)) nextErrors.email = 'Enter the email you signed up with';
    if (!isValidOtp(otp)) nextErrors.otp = 'Enter the 6-digit code';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await verifyOtp({ email: email.trim(), otp: otp.trim() });
      navigate('/events', { replace: true });
    } catch (err) {
      setFormError(err.message || 'That code didn\u2019t work');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">CHECK YOUR INBOX</h1>
      <p className="mt-2 font-body text-sm text-ink/60">{contextMessage}</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        {formError && (
          <div className="rounded-xl border-2 border-flare bg-flare/10 px-4 py-3 font-body text-sm font-medium text-flare">
            {formError}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="6-digit code"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          error={errors.otp}
        />

        <Button type="submit" variant="primary" full loading={loading}>
          Verify & continue
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-xs text-ink/50">
        Codes expire after 5 minutes. Log in again to request a new one.
      </p>
    </div>
  );
}

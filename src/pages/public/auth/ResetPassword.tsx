import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import api from '../../../utils/api';
import axios from 'axios';

// Same rules as Register's validatePassword / the backend's utils.ValidatePassword,
// so the message a user sees here always matches what the backend will accept.
const validatePassword = (password: string) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Must contain a number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Must contain a special character.';
  return '';
};

function PasswordInput({
  value,
  onChange,
  show,
  onToggleShow,
  label,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggleShow: () => void;
  label: string;
  hasError: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[#1C3A2E]">{label}</Label>
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 bg-[#faf8f4] border-2 pr-12 transition-all ${
            hasError
              ? 'border-[#C4522A] focus:border-[#C4522A]'
              : 'border-transparent focus:bg-white focus:border-[#D4A853]'
          }`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1C3A2E] transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1C3A2E]/5 text-center">
          <h2 className="text-[#C4522A] font-serif text-2xl mb-4">Invalid Link</h2>
          <p className="text-[#666666] mb-6">This password reset link is invalid or missing.</p>
          <Link to="/forgot-password">
            <Button className="bg-[#1C3A2E] text-white w-full h-12 rounded-xl">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT FRONTEND VALIDATION — mirrors the backend exactly, single source of truth
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        // Same details-array parsing pattern as Register, so weak-password
        // messages from the backend are shown consistently everywhere.
        if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
          setError(data.details[0].message);
        } else {
          setError(data?.error || 'Failed to reset password. Link may have expired.');
        }
      } else {
        setError('Failed to reset password. Link may have expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
      {/* THE ELEVATED CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1C3A2E]/5"
      >
        <div className="mb-8 text-center">
          <h1 className="font-serif text-[32px] text-[#1C3A2E] mb-2">New Password</h1>
          <p className="text-[#666666] text-sm">Please enter your new secure password.</p>
        </div>

        {success ? (
          <div className="bg-[#9FD4B8]/20 border border-[#9FD4B8] rounded-xl p-6 text-center">
            <h3 className="font-medium text-[#2D5A3D] mb-2">Reset Successful!</h3>
            <p className="text-sm text-[#2D5A3D]/80">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword((v) => !v)}
              hasError={!!error}
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword((v) => !v)}
              hasError={!!error && newPassword !== confirmPassword}
            />

            {error && <p className="text-[13px] text-[#C4522A] font-medium text-center">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl bg-[#D4A853] hover:bg-[#D4A853]/90 text-[#1C3A2E] font-bold mt-2">
              {isLoading ? 'Saving...' : 'Save Password'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import api from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';
import axios from 'axios';

const RESEND_COOLDOWN_SECONDS = 60;

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  // Grab the email passed from the Register page
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown ticks every second until it hits 0, then the resend button unlocks
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // If someone tries to access this page directly without an email, kick them out
  if (!email) {
    return <Navigate to="/register" replace />;
  }

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Auto-focus previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify', { 
        email, 
        otp: otpCode 
      });

      // The backend issued the cookies and returned the user data!
      login(response.data.user);
      
      // Route based on role
      if (response.data.user.role === 'Local Guide' || response.data.user.role === 'LocalGuide') {
        navigate('/guide');
      } else {
        navigate('/traveler');
      }

    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;

    setIsResending(true);
    setError('');
    setResendMessage('');

    try {
      await api.post('/auth/resend-otp', { email });
      setResendMessage('A new code has been sent to your email.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Could not resend code. Please try again.');
      } else {
        setError('Could not resend code. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1C3A2E]/5 text-center"
      >
        <div className="mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="font-serif text-[32px] text-[#1C3A2E] mb-2">Verify Account</h1>
          <p className="text-[#666666] text-sm">
            We've sent a 6-digit code to <br/>
            <span className="font-medium text-[#1C3A2E]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-xl font-medium rounded-xl border-2 transition-all outline-none ${
                  error ? 'border-[#C4522A] bg-[#C4522A]/5' : 
                  digit ? 'border-[#D4A853] bg-white' : 
                  'border-[#1C3A2E]/10 bg-[#faf8f4] focus:border-[#D4A853] focus:bg-white'
                }`}
              />
            ))}
          </div>

          {error && <p className="text-[13px] text-[#C4522A] font-medium">{error}</p>}
          {!error && resendMessage && (
            <p className="text-[13px] text-[#2D5A3D] font-medium">{resendMessage}</p>
          )}

          <Button 
            type="submit" 
            disabled={isLoading || otp.join('').length !== 6} 
            className="w-full h-12 rounded-xl bg-[#1C3A2E] hover:bg-[#1C3A2E]/90 text-[#F5EDD8] font-medium"
          >
            {isLoading ? 'Verifying...' : 'Verify & Login'}
          </Button>
        </form>

        {/* Resend code with cooldown timer */}
        <div className="mt-6 text-sm text-[#666666]">
          {secondsLeft > 0 ? (
            <p>
              Didn't get a code? Resend in{' '}
              <span className="font-medium text-[#1C3A2E] tabular-nums">
                {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
                {String(secondsLeft % 60).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <p>
              Didn't get a code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-[#D4A853] hover:text-[#1C3A2E] transition-colors underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend code'}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

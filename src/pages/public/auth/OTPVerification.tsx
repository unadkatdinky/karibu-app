import { useState, useRef} from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import api from '../../../utils/api';
import { useAuthStore } from '../../../store/useAuthStore';

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  // Grab the email passed from the Register page
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

          <Button 
            type="submit" 
            disabled={isLoading || otp.join('').length !== 6} 
            className="w-full h-12 rounded-xl bg-[#1C3A2E] hover:bg-[#1C3A2E]/90 text-[#F5EDD8] font-medium"
          >
            {isLoading ? 'Verifying...' : 'Verify & Login'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
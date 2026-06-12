import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import api from '../../../utils/api'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSubmitted(true);
    } catch (err) {
      // Using type 'any' or proper axios error typing here depending on your strictness
      const errorMessage = (err as any).response?.data?.error || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#1C3A2E]/5"
      >
        <div className="mb-8 text-center">
          <h1 className="font-serif text-[32px] text-[#1C3A2E] mb-2">Reset Password</h1>
          <p className="text-[#666666] text-sm">Enter the email associated with your account.</p>
        </div>

        {isSubmitted ? (
          <div className="bg-[#1C3A2E]/5 border border-[#1C3A2E]/10 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">📬</div>
            <h3 className="font-medium text-[#1C3A2E]">Check your inbox</h3>
            <p className="text-sm text-[#666666]">
              If an account exists for <span className="font-medium text-[#1C3A2E]">{email}</span>, we've sent instructions to reset your password.
            </p>
            <Link to="/login" className="block w-full">
              <Button className="w-full h-12 rounded-xl bg-[#1C3A2E] text-white mt-2">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1C3A2E]">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className={`h-12 bg-[#faf8f4] border-transparent focus:bg-white focus:border-[#D4A853] transition-all`}
              />
              {error && <p className="text-[13px] text-[#C4522A] font-medium mt-1 text-center">{error}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl bg-[#1C3A2E] hover:bg-[#1C3A2E]/90 text-[#F5EDD8] font-medium mt-2">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-[#666666] hover:text-[#1C3A2E] transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import api from '../../../utils/api'; // Your custom axios instance

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
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
      >
        <div className="mb-8 text-center">
          <h1 className="font-serif text-[32px] text-[#1C3A2E] mb-2">Reset Password</h1>
          <p className="text-[#666666] text-sm">Enter the email associated with your account.</p>
        </div>

        {isSubmitted ? (
          <div className="bg-[#1C3A2E]/5 border border-[#1C3A2E]/10 rounded-xl p-6 text-center space-y-4">
            <div className="text-4xl">📬</div>
            <h3 className="font-medium text-[#1C3A2E]">Check your inbox</h3>
            <p className="text-sm text-[#666666]">If an account exists for {email}, we've sent instructions on how to reset your password.</p>
            <Link to="/login" className="block text-sm font-medium text-[#D4A853] hover:text-[#1C3A2E] mt-4">
              Return to Login
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
                className={`h-12 bg-white border-2 ${error ? 'border-[#C4522A]' : 'border-[#1C3A2E]/10 focus:border-[#D4A853]'}`}
              />
              {error && <p className="text-[12px] text-[#C4522A] font-medium mt-1">{error}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#1C3A2E] hover:bg-[#1C3A2E]/90 text-[#F5EDD8]">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center mt-6">
              <Link to="/login" className="text-sm font-medium text-[#666666] hover:text-[#1C3A2E]">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
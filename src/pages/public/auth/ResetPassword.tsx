import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import api from '../../../utils/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // NEW STATE
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
    
    // STRICT FRONTEND VALIDATION
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. Link may have expired.');
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
            <div className="space-y-2">
              <Label className="text-[#1C3A2E]">New Password</Label>
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`h-12 bg-[#faf8f4] border-transparent focus:bg-white focus:border-[#D4A853] transition-all`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#1C3A2E]">Confirm Password</Label>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 bg-[#faf8f4] border-transparent focus:bg-white focus:border-[#D4A853] transition-all`}
              />
            </div>

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
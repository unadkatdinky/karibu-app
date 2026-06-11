import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import api from '../../../utils/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Grabs the token from the URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // If someone just types /reset-password without a token in the URL
  if (!token) {
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center text-center p-6">
        <div>
          <h2 className="text-[#C4522A] font-serif text-2xl mb-4">Invalid Reset Link</h2>
          <p className="text-[#666666] mb-6">This password reset link is invalid or missing.</p>
          <Link to="/forgot-password">
            <Button className="bg-[#1C3A2E] text-white">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
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
          <h1 className="font-serif text-[32px] text-[#1C3A2E] mb-2">Create New Password</h1>
          <p className="text-[#666666] text-sm">Please enter your new secure password.</p>
        </div>

        {success ? (
          <div className="bg-[#9FD4B8]/20 border border-[#9FD4B8] rounded-xl p-6 text-center">
            <h3 className="font-medium text-[#2D5A3D] mb-2">Password Reset Successful!</h3>
            <p className="text-sm text-[#2D5A3D]/80">Redirecting you to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1C3A2E]">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={`h-12 bg-white border-2 ${error ? 'border-[#C4522A]' : 'border-[#1C3A2E]/10 focus:border-[#D4A853]'}`}
              />
              {error && <p className="text-[12px] text-[#C4522A] font-medium mt-1">{error}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#D4A853] hover:bg-[#D4A853]/90 text-[#1C3A2E] font-bold">
              {isLoading ? 'Resetting...' : 'Save New Password'}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
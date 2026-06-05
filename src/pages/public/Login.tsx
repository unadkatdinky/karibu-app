import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); 
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] flex">
      {/* Left Side: Editorial Image */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1C3A2E] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80" 
          alt="Kilimanjaro at dusk" 
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20 text-[#F5EDD8]">
          <p className="font-serif text-[32px] leading-snug mb-4">
            "Welcome back. Your next journey begins where the last one ended."
          </p>
        </div>
      </div>

      {/* Right Side: Quick Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-[400px]">
          <div className="mb-10">
            <h1 className="font-serif text-[40px] text-[#1C3A2E] mb-2 leading-none">Sign In</h1>
            <p className="text-[15px] text-[#666666]">Access your Karibu passport and travel notes.</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="alex@example.com" required className="h-12 bg-white" />
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-[12px] text-[#D4A853] hover:text-[#1C3A2E] font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input id="password" type="password" required className="h-12 bg-white" />
            </div>

            <Button type="submit" className="w-full h-12 bg-[#1C3A2E] hover:bg-[#1C3A2E]/90 text-[#F5EDD8] rounded-xl text-[14px] font-medium mt-2" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#1C3A2E]/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#faf8f4] px-4 text-[#666666] font-medium tracking-wider">Or continue with</span></div>
          </div>

          <Button variant="outline" className="w-full h-12 bg-white hover:bg-gray-50 border-[#1C3A2E]/10 rounded-xl text-[#1C3A2E] font-medium flex items-center justify-center gap-3 transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Sign in with Google
          </Button>

          <p className="mt-8 text-center text-[14px] text-[#666666]">
            Don't have an account? <Link to="/register" className="text-[#D4A853] hover:text-[#1C3A2E] font-medium underline underline-offset-4">Create one here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Traveler' | 'Local Guide'>('Traveler');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000); 
  };

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* Left Side: Onboarding Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-[#faf8f4]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-[440px]">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-widest font-medium text-[#D4A853] mb-2">Join the Community</p>
            <h1 className="font-serif text-[40px] text-[#1C3A2E] leading-none mb-3">Create your Passport</h1>
            <p className="text-[15px] text-[#666666]">How do you want to experience Karibu?</p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            
            {/* Visual Role Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                type="button"
                onClick={() => setSelectedRole('Traveler')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === 'Traveler' 
                    ? 'border-[#1C3A2E] bg-white shadow-sm' 
                    : 'border-transparent bg-[#1C3A2E]/5 hover:bg-[#1C3A2E]/10'
                }`}
              >
                <div className="text-[18px] mb-1">🌍</div>
                <p className={`font-medium text-[14px] ${selectedRole === 'Traveler' ? 'text-[#1C3A2E]' : 'text-[#666666]'}`}>Traveler</p>
                <p className="text-[12px] text-gray-400 mt-1">Discover & Plan</p>
              </button>
              
              <button 
                type="button"
                onClick={() => setSelectedRole('Local Guide')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedRole === 'Local Guide' 
                    ? 'border-[#D4A853] bg-white shadow-sm' 
                    : 'border-transparent bg-[#1C3A2E]/5 hover:bg-[#1C3A2E]/10'
                }`}
              >
                <div className="text-[18px] mb-1">🤝</div>
                <p className={`font-medium text-[14px] ${selectedRole === 'Local Guide' ? 'text-[#1C3A2E]' : 'text-[#666666]'}`}>Local Guide</p>
                <p className="text-[12px] text-gray-400 mt-1">Host & Share</p>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="E.g. Alex Chen" required className="h-12 bg-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="alex@example.com" required className="h-12 bg-white" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input id="password" type="password" required className="h-12 bg-white" />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-[#D4A853] hover:bg-[#D4A853]/90 text-[#1C3A2E] rounded-xl text-[14px] font-bold mt-4 shadow-sm" disabled={isLoading}>
              {isLoading ? "Creating Account..." : `Continue as ${selectedRole}`}
            </Button>

            {/* Google Signup */}
            <Button type="button" variant="outline" className="w-full h-12 bg-white hover:bg-gray-50 border-[#1C3A2E]/10 rounded-xl text-[#1C3A2E] font-medium flex items-center justify-center gap-3 transition-all mt-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Sign up with Google
            </Button>
          </form>

          <p className="mt-8 text-center text-[14px] text-[#666666]">
            Already have an account? <Link to="/login" className="text-[#1C3A2E] font-medium underline underline-offset-4">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden lg:block w-1/2 relative bg-[#F5EDD8] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80" 
          alt="Local culture" 
          className="object-cover w-full h-full opacity-90"
        />
      </div>
    </div>
  );
}
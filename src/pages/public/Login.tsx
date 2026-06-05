import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] as const // <-- Add "as const" right here
    } 
  }
};
export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate backend auth check and role assignment
    setTimeout(() => {
      let determinedRole: 'Admin' | 'Traveler' | 'Local Guide' = 'Traveler';
      let determinedName = 'Guest Explorer';

      if (email.toLowerCase().includes('admin')) {
        determinedRole = 'Admin';
        determinedName = 'Dinky Unadkat';
      } else if (email.toLowerCase().includes('volunteer')) {
        determinedRole = 'Local Guide';
        determinedName = 'Community Guide';
      }

      login({ id: '1', name: determinedName, role: determinedRole }, "mock_jwt_token");
      setIsLoading(false);
      
      // Route based on the role the "backend" gave us
      navigate(determinedRole === 'Admin' ? '/admin' : '/dashboard');
    }, 1200);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-green-deep px-6 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,168,83,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,82,42,0.1),transparent_50%)] pointer-events-none" />

      {/* Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] bg-white/5 backdrop-blur-2xl p-10 md:p-14 rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative z-10"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">
          
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="font-serif text-[36px] text-cream leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[14px] text-cream/60 tracking-wide">
              Enter your details to access your portal.
            </p>
          </motion.div>

          <form onSubmit={handleAuth} className="space-y-6">
            <motion.div variants={itemVariants}>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-2 py-3 border-b border-cream/20 text-cream text-[15px] placeholder-cream/30 outline-none focus:border-gold transition-colors"
                placeholder="Email address"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent px-2 py-3 border-b border-cream/20 text-cream text-[15px] placeholder-cream/30 outline-none focus:border-gold transition-colors"
                placeholder="Password"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[#C4522A] text-cream text-[13px] tracking-widest uppercase font-medium rounded-full hover:bg-[#A34220] shadow-[0_8px_20px_rgba(196,82,42,0.25)] hover:shadow-[0_12px_25px_rgba(196,82,42,0.4)] transition-all duration-300 disabled:opacity-70 flex justify-center items-center hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="text-center mt-8 text-[12px] text-cream/40">
            <p>Test emails: admin@... | volunteer@... | traveler@...</p>
          </motion.div>

        </motion.div>
      </motion.div>
    </section>
  );
}
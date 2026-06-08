import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState({ email: false, password: false });

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const fieldError = field === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const fieldError = field === 'email' ? validateEmail(formData.email) : validatePassword(formData.password);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

  return (
    <div className="min-h-screen bg-[#faf8f4] flex">
      {/* Left Side: Editorial Image */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1C3A2E] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80" 
          alt="Kilimanjaro at dusk" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center px-12"
          >
            <div className="mb-6">
              <div className="text-6xl mb-4">🌍</div>
            </div>
            <p className="font-serif text-[32px] leading-snug mb-4 text-[#F5EDD8]">
              "Welcome back. Your next journey begins where the last one ended."
            </p>
            <div className="mt-12 pt-8 border-t border-[#D4A853]/30">
              <p className="text-[#D4A853] text-sm tracking-widest uppercase font-medium">Karibu East Africa</p>
              <p className="text-[#F5EDD8] text-xs mt-2 opacity-70">Through the eyes of someone who grew up there</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px]"
        >
          {/* Header */}
          <div className="mb-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[11px] uppercase tracking-widest font-medium text-[#D4A853] mb-3">Welcome Back</p>
            </motion.div>
            <h1 className="font-serif text-[42px] text-[#1C3A2E] mb-2 leading-none">Sign In</h1>
            <p className="text-[15px] text-[#666666]">Access your Karibu passport and continue exploring.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2.5">
              <Label 
                htmlFor="email"
                className={`block text-sm font-medium transition-colors ${
                  errors.email && touched.email ? 'text-[#C4522A]' : 'text-[#1C3A2E]'
                }`}
              >
                Email address
              </Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`h-12 bg-white border-2 rounded-xl transition-all ${
                    errors.email && touched.email
                      ? 'border-[#C4522A] focus:border-[#C4522A] focus:ring-[#C4522A]/10'
                      : 'border-[#1C3A2E]/10 focus:border-[#D4A853] focus:ring-[#D4A853]/10'
                  }`}
                />
                {errors.email && touched.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[12px] text-[#C4522A] mt-1.5 font-medium"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label 
                  htmlFor="password"
                  className={`text-sm font-medium transition-colors ${
                    errors.password && touched.password ? 'text-[#C4522A]' : 'text-[#1C3A2E]'
                  }`}
                >
                  Password
                </Label>
                <Link 
                  to="/forgot-password"
                  className="text-[12px] text-[#D4A853] hover:text-[#1C3A2E] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`h-12 bg-white border-2 rounded-xl pr-12 transition-all ${
                    errors.password && touched.password
                      ? 'border-[#C4522A] focus:border-[#C4522A] focus:ring-[#C4522A]/10'
                      : 'border-[#1C3A2E]/10 focus:border-[#D4A853] focus:ring-[#D4A853]/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1C3A2E] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
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
                {errors.password && touched.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[12px] text-[#C4522A] mt-1.5 font-medium"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                type="submit" 
                disabled={!isFormValid || isLoading}
                className={`w-full h-12 rounded-xl text-[14px] font-medium transition-all mt-2 ${
                  isFormValid && !isLoading
                    ? 'bg-[#1C3A2E] hover:bg-[#1C3A2E]/90 text-[#F5EDD8] cursor-pointer'
                    : 'bg-[#1C3A2E]/50 text-[#F5EDD8]/50 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#F5EDD8]/30 border-t-[#F5EDD8] rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#1C3A2E]/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#faf8f4] px-4 text-[#666666] font-medium tracking-wider">Or continue with</span></div>
          </div>

          {/* Google Button */}
          <Button 
            type="button"
            className="w-full h-12 bg-white hover:bg-gray-50 border-2 border-[#1C3A2E]/10 rounded-xl text-[#1C3A2E] font-medium flex items-center justify-center gap-3 transition-all hover:border-[#D4A853]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </Button>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-[14px] text-[#666666]">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-[#D4A853] hover:text-[#1C3A2E] font-medium transition-colors underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-[#1C3A2E]/10 flex items-center justify-center gap-4 text-[12px] text-[#666666]"
          >
            <span className="flex items-center gap-1">🔒 Encrypted</span>
            <span className="text-[#1C3A2E]/20">•</span>
            <span className="flex items-center gap-1">✓ Secure</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import api from '../../../utils/api'; // Your custom axios instance
// import { useAuthStore } from '../../../store/useAuthStore';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  // const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Traveler' | 'Local Guide'>('Traveler');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false });

  // Validation functions
  const validateFullName = (name: string) => {
    if (!name) return 'Full name is required';
    if (name.trim().length < 2) return 'Please enter your full name';
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must include a number';
    return '';
  };

  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#C4522A', '#D4A853', '#9FD4B8', '#2D5A3D'];

  const handleChange = (field: 'fullName' | 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      let fieldError = '';
      if (field === 'fullName') fieldError = validateFullName(value);
      else if (field === 'email') fieldError = validateEmail(value);
      else fieldError = validatePassword(value);
      
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleBlur = (field: 'fullName' | 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let fieldError = '';
    if (field === 'fullName') fieldError = validateFullName(formData.fullName);
    else if (field === 'email') fieldError = validateEmail(formData.email);
    else fieldError = validatePassword(formData.password);
    
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  const getPasswordStrengthError = (password: string) => {
  if (!password) return '';
  if (password.length < 8) return 'Must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Must contain a number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Must contain a special character.';
  return ''; // Returns empty string if it passes all tests!
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // STRICT FRONTEND VALIDATION
    const nameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (nameError || emailError || passwordError) {
      setErrors({ fullName: nameError, email: emailError, password: passwordError });
      return;
    }

    if (formData.password !== confirmPassword) {
      setErrors(prev => ({ ...prev, password: "Passwords do not match." }));
      return;
    }

    setIsLoading(true);
    
    try {
      await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: selectedRole === 'Local Guide' ? 'LocalGuide' : 'Traveler' 
      });

      // Route them to the OTP page and pass the email invisibly
      navigate('/verify-otp', { state: { email: formData.email } });

    } catch (error) {
      console.error("Registration failed:", error);
      
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        
        // CATCH SPECIFIC BACKEND VALIDATION ERRORS
        // Check if our Go backend sent the detailed PasswordError array
        if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
          // Grab the exact message from the first error in the array!
          setErrors(prev => ({ ...prev, password: data.details[0].message }));
        } 
        // Catch duplicate email errors
        else if (error.response?.status === 409) {
          setErrors(prev => ({ ...prev, email: data?.error || "Email already exists" }));
        } 
        // Fallback for generic errors
        else {
          setErrors(prev => ({ ...prev, password: data?.error || "Server error. Please try again." }));
        }
      } else {
        setErrors(prev => ({ ...prev, password: "An unexpected error occurred." }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.fullName && 
    formData.email && 
    formData.password &&
    !errors.fullName &&
    !errors.email &&
    !errors.password &&
    confirmPassword && // Must not be empty
    formData.password === confirmPassword && // Must match
    passwordStrength >= 2;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-[#faf8f4]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[460px]"
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[11px] uppercase tracking-widest font-medium text-[#D4A853] mb-3">Join the Community</p>
            </motion.div>
            <h1 className="font-serif text-[42px] text-[#1C3A2E] leading-none mb-3">Create your Passport</h1>
            <p className="text-[15px] text-[#666666]">How do you want to experience Karibu?</p>
          </div>

          {/* Role Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <button 
              type="button"
              onClick={() => setSelectedRole('Traveler')}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                selectedRole === 'Traveler' 
                  ? 'border-[#1C3A2E] bg-white shadow-lg scale-105' 
                  : 'border-transparent bg-[#1C3A2E]/5 hover:bg-[#1C3A2E]/10 hover:scale-102'
              }`}
            >
              <div className="text-5xl mb-2">🌍</div>
              <p className={`font-serif text-[16px] ${selectedRole === 'Traveler' ? 'text-[#1C3A2E]' : 'text-[#666666]'}`}>Traveler</p>
              <p className="text-[12px] text-gray-400 mt-1.5">Discover & Plan</p>
            </button>
            
            <button 
              type="button"
              onClick={() => setSelectedRole('Local Guide')}
              className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                selectedRole === 'Local Guide' 
                  ? 'border-[#D4A853] bg-white shadow-lg scale-105' 
                  : 'border-transparent bg-[#1C3A2E]/5 hover:bg-[#1C3A2E]/10 hover:scale-102'
              }`}
            >
              <div className="text-5xl mb-2">🤝</div>
              <p className={`font-serif text-[16px] ${selectedRole === 'Local Guide' ? 'text-[#1C3A2E]' : 'text-[#666666]'}`}>Local Guide</p>
              <p className="text-[12px] text-gray-400 mt-1.5">Host & Share</p>
            </button>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label 
                htmlFor="name"
                className={`block text-sm font-medium transition-colors ${
                  errors.fullName && touched.fullName ? 'text-[#C4522A]' : 'text-[#1C3A2E]'
                }`}
              >
                Full Name
              </Label>
              <Input 
                id="name" 
                placeholder="E.g. Alex Chen"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`h-12 bg-white border-2 rounded-xl transition-all ${
                  errors.fullName && touched.fullName
                    ? 'border-[#C4522A] focus:border-[#C4522A] focus:ring-[#C4522A]/10'
                    : 'border-[#1C3A2E]/10 focus:border-[#D4A853] focus:ring-[#D4A853]/10'
                }`}
              />
              {errors.fullName && touched.fullName && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] text-[#C4522A] font-medium"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <Label 
                htmlFor="email"
                className={`block text-sm font-medium transition-colors ${
                  errors.email && touched.email ? 'text-[#C4522A]' : 'text-[#1C3A2E]'
                }`}
              >
                Email address
              </Label>
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
                  className="text-[12px] text-[#C4522A] font-medium"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>
            
            {/* Password */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label 
                htmlFor="password"
                className={`block text-sm font-medium transition-colors ${
                  errors.password && touched.password ? 'text-[#C4522A]' : 'text-[#1C3A2E]'
                }`}
              >
                Create Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
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
                {formData.password && getPasswordStrengthError(formData.password) && (
                <p className="text-[12px] text-[#C4522A] mt-1 font-medium">
                  {getPasswordStrengthError(formData.password)}
                </p>
              )}
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i <= passwordStrength ? 'opacity-100' : 'opacity-20 bg-gray-300'
                        }`}
                        style={{
                          backgroundColor: i <= passwordStrength ? strengthColors[passwordStrength] : undefined
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[12px] font-medium" style={{ color: strengthColors[passwordStrength] }}>
                    Password strength: <span className="font-semibold">{strengthLabels[passwordStrength]}</span>
                  </p>
                </motion.div>
              )}

              {errors.password && touched.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] text-[#C4522A] font-medium"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="space-y-2"
            >
              <Label 
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#1C3A2E]"
              >
                Confirm Password
              </Label>
              <Input 
                id="confirmPassword" 
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 bg-white border-2 rounded-xl pr-12 transition-all ${
                  formData.password && confirmPassword && formData.password !== confirmPassword
                    ? 'border-[#C4522A] focus:border-[#C4522A] focus:ring-[#C4522A]/10'
                    : 'border-[#1C3A2E]/10 focus:border-[#D4A853] focus:ring-[#D4A853]/10'
                }`}
              />
              {/* Optional: Real-time match indicator */}
              {confirmPassword && formData.password !== confirmPassword && (
                <p className="text-[12px] text-[#C4522A] mt-1.5 font-medium">
                  Passwords do not match
                </p>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Button 
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full h-12 rounded-xl text-[14px] font-bold transition-all mt-4 ${
                  isFormValid && !isLoading
                    ? 'bg-[#D4A853] hover:bg-[#D4A853]/90 text-[#1C3A2E] cursor-pointer shadow-lg hover:shadow-xl'
                    : 'bg-[#D4A853]/50 text-[#1C3A2E]/50 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#1C3A2E]/30 border-t-[#1C3A2E] rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  `Continue as ${selectedRole}`
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="relative my-6">
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
              Sign up with Google
            </Button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-[14px] text-[#666666]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#1C3A2E] font-medium hover:text-[#D4A853] transition-colors underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-[#1C3A2E]/10"
          >
            <p className="text-[11px] text-[#666666] text-center mb-3">TRUSTED BY TRAVELERS & GUIDES</p>
            <div className="flex items-center justify-center gap-4 text-[12px] text-[#666666]">
              <span className="flex items-center gap-1">🔒 Data encrypted</span>
              <span className="text-[#1C3A2E]/20">•</span>
              <span className="flex items-center gap-1">✓ Verified users</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side: Editorial Image */}
      <div className="hidden lg:block w-1/2 relative bg-gradient-to-b from-[#F5EDD8] to-[#EDE3D0] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80" 
          alt="Local culture and community" 
          className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-700"
        />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute bottom-12 left-12 right-12 z-20"
        >
          <p className="font-serif text-[28px] leading-snug text-white drop-shadow-lg">
            "The most powerful thing you can build is something only you could have made."
          </p>
          <p className="text-[#F5EDD8] text-sm mt-4 opacity-90">Built by someone from East Africa</p>
        </motion.div>
      </div>
    </div>
  );
}
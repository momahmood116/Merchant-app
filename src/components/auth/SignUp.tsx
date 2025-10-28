import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { OTPInput } from '../OTPInput';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface SignUpProps {
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUp({ onSuccess, onSwitchToSignIn }: SignUpProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNumber || !fullName || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await api.sendOTP(phoneNumber);
      setGeneratedOTP(result.otp); // In production, this would be sent via SMS
      toast.success(`OTP sent to ${phoneNumber}. Demo OTP: ${result.otp}`);
      setStep('otp');
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignUp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await api.verifyOTP(phoneNumber, otp);
      await api.signUp(phoneNumber, fullName, password);
      
      toast.success('Account created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP or create account');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCountdown(60);
    setOtp('');
    try {
      const result = await api.sendOTP(phoneNumber);
      setGeneratedOTP(result.otp);
      toast.success(`OTP resent. Demo OTP: ${result.otp}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            >
              <span className="text-white">YBS</span>
            </motion.div>
            <h1 className="text-primary mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join YBS Merchant Network</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'details' ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+964 XXX XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 h-12 rounded-2xl bg-input-background border-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-12 h-12 rounded-2xl bg-input-background border-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-2xl bg-input-background border-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator password={password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-2xl bg-input-background border-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={onSwitchToSignIn}
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="mb-2">Verify Your Number</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to<br />
                    <span className="text-primary">{phoneNumber}</span>
                  </p>
                  {generatedOTP && (
                    <p className="text-sm text-green-600 mt-2">
                      Demo OTP: {generatedOTP}
                    </p>
                  )}
                </div>

                <OTPInput value={otp} onChange={setOtp} />

                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-3 relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  >
                    <svg className="w-full h-full">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#E8DFF5"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#5B2C83"
                        strokeWidth="4"
                        strokeDasharray={`${(countdown / 60) * 175.93} 175.93`}
                        transform="rotate(-90 32 32)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                      {countdown}
                    </div>
                  </motion.div>
                  
                  {countdown === 0 ? (
                    <button
                      onClick={handleResendOTP}
                      className="text-primary hover:underline text-sm"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Resend code in {countdown}s
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleVerifyAndSignUp}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
                >
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </Button>

                <button
                  onClick={() => setStep('details')}
                  className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

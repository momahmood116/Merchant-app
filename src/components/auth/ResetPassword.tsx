import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { OTPInput } from '../OTPInput';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface ResetPasswordProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function ResetPassword({ onBack, onSuccess }: ResetPasswordProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await api.sendOTP(phoneNumber);
      setGeneratedOTP(result.otp);
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

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await api.verifyOTP(phoneNumber, otp);
      toast.success('OTP verified successfully');
      setStep('password');
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(phoneNumber, newPassword);
      setStep('success');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
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
          <button
            onClick={onBack}
            className="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-primary mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              {step === 'phone' && 'Enter your phone number to reset password'}
              {step === 'otp' && 'Verify your identity'}
              {step === 'password' && 'Create a new password'}
              {step === 'success' && 'Password reset successful'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <motion.div
                key="phone"
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

                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
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
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </motion.div>
            )}

            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  <PasswordStrengthIndicator password={newPassword} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
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
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
                </motion.div>

                <div>
                  <h2 className="text-primary mb-2">Password Reset Successful!</h2>
                  <p className="text-muted-foreground">
                    You can now sign in with your new password
                  </p>
                </div>

                <Button
                  onClick={onSuccess}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  Go to Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

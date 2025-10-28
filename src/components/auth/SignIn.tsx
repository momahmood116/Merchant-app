import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface SignInProps {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

export function SignIn({ onSuccess, onSwitchToSignUp, onForgotPassword }: SignInProps) {
  const { signIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(phoneNumber, password);
      toast.success('Welcome back!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    toast.info('Biometric authentication is not available in this demo');
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
            <h1 className="text-primary mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your merchant account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleBiometricLogin}
              className="w-full h-12 rounded-2xl border-2 border-primary/30 hover:bg-primary/5"
            >
              <Fingerprint className="mr-2 w-5 h-5 text-primary" />
              Sign in with Biometrics
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-primary hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

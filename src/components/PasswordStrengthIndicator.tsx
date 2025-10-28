import { motion } from 'motion/react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = calculateStrength(password);
  const percentage = (strength / 5) * 100;

  const getColor = () => {
    if (strength <= 2) return 'bg-destructive';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {getLabel() && (
        <p className="text-sm text-muted-foreground">
          Password strength: <span className={strength >= 4 ? 'text-green-600' : strength >= 3 ? 'text-yellow-600' : 'text-destructive'}>{getLabel()}</span>
        </p>
      )}
    </div>
  );
}

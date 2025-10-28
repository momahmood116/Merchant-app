import { motion } from 'motion/react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-white">YBS</div>
        </motion.div>
      </motion.div>
    </div>
  );
}

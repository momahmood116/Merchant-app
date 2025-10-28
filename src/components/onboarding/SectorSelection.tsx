import { motion } from 'motion/react';
import { MERCHANT_SECTORS } from '../../types/application';

interface SectorSelectionProps {
  selected?: string;
  onSelect: (sector: string) => void;
}

export function SectorSelection({ selected, onSelect }: SectorSelectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {MERCHANT_SECTORS.map((sector, index) => (
        <motion.button
          key={sector.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(sector.value)}
          className={`p-4 rounded-2xl border-2 transition-all text-left ${
            selected === sector.value
              ? 'border-primary bg-primary/5 shadow-lg'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="text-3xl mb-2">{sector.icon}</div>
          <div className="text-sm">{sector.label}</div>
        </motion.button>
      ))}
    </div>
  );
}

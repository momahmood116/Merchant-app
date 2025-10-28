import { motion } from 'motion/react';
import { Flag } from 'lucide-react';
import { Nationality } from '../../types/application';

interface NationalitySelectionProps {
  selected: Nationality | undefined;
  onSelect: (nationality: Nationality) => void;
}

export function NationalitySelection({ selected, onSelect }: NationalitySelectionProps) {
  const options = [
    {
      value: 'Iraqi' as Nationality,
      label: 'Iraqi National',
      flag: '🇮🇶',
      description: 'For Iraqi citizens with National ID',
    },
    {
      value: 'Non-Iraqi' as Nationality,
      label: 'Non-Iraqi',
      flag: '🌍',
      description: 'For foreign nationals with Passport',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {options.map((option, index) => (
        <motion.button
          key={option.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option.value)}
          className={`p-8 rounded-2xl border-2 transition-all text-left ${
            selected === option.value
              ? 'border-primary bg-primary/5 shadow-lg'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">{option.flag}</div>
            <div className="flex-1">
              <h3 className="text-primary mb-1">{option.label}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            {selected === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

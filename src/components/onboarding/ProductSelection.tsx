import { motion } from 'motion/react';
import { Smartphone, CreditCard, ArrowRight } from 'lucide-react';
import { ProductType } from '../../types/application';
import { Button } from '../ui/button';

interface ProductSelectionProps {
  onSelect: (productType: ProductType) => void;
}

export function ProductSelection({ onSelect }: ProductSelectionProps) {
  const products = [
    {
      type: 'POS' as ProductType,
      icon: CreditCard,
      title: 'Point of Sale (POS)',
      description: 'Traditional POS terminal for accepting card payments',
      features: ['Physical device', 'Chip & PIN', 'Receipt printing', 'Offline mode'],
      color: 'from-primary to-purple-600',
    },
    {
      type: 'SoftPOS' as ProductType,
      icon: Smartphone,
      title: 'SoftPOS',
      description: 'Turn your smartphone into a payment terminal',
      features: ['No hardware needed', 'Tap-to-phone', 'Instant setup', 'Cost-effective'],
      color: 'from-secondary to-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-accent/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-primary mb-4">Choose Your Product</h1>
          <p className="text-muted-foreground">
            Select the payment solution that best fits your business needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col">
                <div className={`w-20 h-20 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <product.icon className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-primary mb-3">{product.title}</h2>
                <p className="text-muted-foreground mb-6 flex-grow">{product.description}</p>

                <div className="space-y-3 mb-8">
                  {product.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => onSelect(product.type)}
                  className={`w-full h-12 rounded-2xl bg-gradient-to-r ${product.color} hover:opacity-90 transition-all group-hover:shadow-lg`}
                >
                  Select {product.type}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

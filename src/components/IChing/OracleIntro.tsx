import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PremiumBadge } from './PremiumBadge';
import { SubscribeButton } from './SubscribeButton';

interface OracleIntroProps {
  onBegin: () => void;
  onViewHistory?: () => void;
}

export const OracleIntro = ({ onBegin, onViewHistory }: OracleIntroProps) => {
  const [currentText, setCurrentText] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const introTexts = [
    "Take a breath.",
    "Focus your question.", 
    "Let the oracle guide you."
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % introTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const { isSubscribed, remainingReads } = useSubscription();

  return (
    <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        {/* Premium Badge */}
        <div className="absolute top-4 right-4">
          <PremiumBadge />
        </div>

        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-sacred rounded-full animate-oracle-glow opacity-20 absolute inset-0"></div>
          <div className="w-24 h-24 mx-auto bg-gradient-sacred rounded-full relative animate-mystical-float"></div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            I Ching Oracle
          </h1>
          
          <div className="h-20 flex items-center justify-center">
            <p 
              key={currentText}
              className={`text-xl text-muted-foreground transition-all duration-700 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
            >
              {introTexts[currentText]}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onBegin}
            className="px-8 py-4 text-lg bg-gradient-sacred hover:shadow-oracle transition-all duration-500 hover:scale-105"
            disabled={!isSubscribed && remainingReads <= 0}
          >
            {isSubscribed ? 'Begin Consultation' : 
              remainingReads > 0 ? 'Begin Consultation' : 'No Free Readings Left Today'}
          </Button>

          {!isSubscribed && remainingReads <= 0 && (
            <div className="text-sm text-accent animate-pulse mt-2">
              Subscribe for unlimited readings
            </div>
          )}
          
          <div className="mt-3 flex justify-center">
            <SubscribeButton />
          </div>
          
          {isSubscribed && onViewHistory && (
            <div className="mt-2">
              <Button 
                variant="ghost" 
                className="text-sm flex items-center"
                onClick={onViewHistory}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                View My Reading History
              </Button>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mt-6">
            The I Ching is an ancient Chinese divination system. 
            Through six coin tosses, we'll generate a hexagram to illuminate your path forward.
          </p>
        </div>
      </div>
    </div>
  );
};
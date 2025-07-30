import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CoinTossProps {
  onComplete: (lines: string[]) => void;
}

type LineType = 'yin' | 'yang' | 'changing-yin' | 'changing-yang';

export const CoinToss = ({ onComplete }: CoinTossProps) => {
  const [currentToss, setCurrentToss] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lines, setLines] = useState<LineType[]>([]);
  const [coins, setCoins] = useState<('heads' | 'tails')[]>([]);
  const [showResult, setShowResult] = useState(false);

  const tossCoins = () => {
    setIsFlipping(true);
    setShowResult(false);
    
    // Simulate coin tosses with delay
    setTimeout(() => {
      const newCoins: ('heads' | 'tails')[] = [];
      for (let i = 0; i < 3; i++) {
        newCoins.push(Math.random() > 0.5 ? 'heads' : 'tails');
      }
      setCoins(newCoins);
      
      // Calculate line type based on coin results
      const headsCount = newCoins.filter(coin => coin === 'heads').length;
      let lineType: LineType;
      
      switch (headsCount) {
        case 0: // All tails
          lineType = 'changing-yin';
          break;
        case 1: // Two tails, one head
          lineType = 'yang';
          break;
        case 2: // Two heads, one tail
          lineType = 'yin';
          break;
        case 3: // All heads
          lineType = 'changing-yang';
          break;
        default:
          lineType = 'yang';
      }
      
      setLines(prev => [...prev, lineType]);
      setIsFlipping(false);
      setShowResult(true);
    }, 1000);
  };

  const nextToss = () => {
    if (currentToss < 5) {
      setCurrentToss(prev => prev + 1);
      setShowResult(false);
    } else {
      // Convert lines to simple yin/yang for hexagram
      const simplifiedLines = lines.map(line => 
        line.includes('yang') ? 'yang' : 'yin'
      );
      onComplete(simplifiedLines);
    }
  };

  const renderLine = (lineType: LineType) => {
    const baseClasses = "w-16 h-2 mx-auto transition-all duration-500";
    
    switch (lineType) {
      case 'yang':
        return <div className={`${baseClasses} bg-primary`}></div>;
      case 'yin':
        return (
          <div className={`${baseClasses} flex justify-between`}>
            <div className="w-7 h-2 bg-primary"></div>
            <div className="w-7 h-2 bg-primary"></div>
          </div>
        );
      case 'changing-yang':
        return <div className={`${baseClasses} bg-accent animate-sacred-pulse`}></div>;
      case 'changing-yin':
        return (
          <div className={`${baseClasses} flex justify-between animate-sacred-pulse`}>
            <div className="w-7 h-2 bg-accent"></div>
            <div className="w-7 h-2 bg-accent"></div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            Line {currentToss + 1} of 6
          </h2>
          <p className="text-muted-foreground">
            Toss the three coins to determine this line
          </p>
        </div>

        {/* Coins Display */}
        <div className="flex justify-center space-x-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center text-sm font-bold transition-all duration-1000 ${
                isFlipping ? 'animate-coin-flip' : ''
              } ${coins[index] === 'heads' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
            >
              {!isFlipping && coins.length > 0 ? (coins[index] === 'heads' ? '龍' : '○') : '?'}
            </div>
          ))}
        </div>

        {/* Current Lines Built */}
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground">Your hexagram so far:</h3>
          <div className="space-y-1 bg-card/20 rounded-lg p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex justify-center">
                {lines[index] ? (
                  <div className="animate-hexagram-reveal">
                    {renderLine(lines[index])}
                  </div>
                ) : (
                  <div className="w-16 h-2 border border-muted-foreground/30 rounded opacity-30"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {!showResult ? (
            <Button 
              onClick={tossCoins}
              disabled={isFlipping}
              className="px-8 py-4 text-lg bg-gradient-sacred hover:shadow-oracle transition-all duration-500"
            >
              {isFlipping ? 'Casting...' : 'Toss Coins'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-accent">
                {coins.filter(c => c === 'heads').length} heads, {coins.filter(c => c === 'tails').length} tails
              </div>
              <Button 
                onClick={nextToss}
                className="px-8 py-4 text-lg bg-gradient-sacred hover:shadow-oracle transition-all duration-500"
              >
                {currentToss < 5 ? 'Next Line' : 'Reveal Hexagram'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
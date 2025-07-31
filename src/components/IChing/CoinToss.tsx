import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CoinTossProps {
  onComplete: (lines: ('yin' | 'yang' | 'changing-yin' | 'changing-yang')[]) => void;
  onRestart?: () => void;
}

type LineType = 'yin' | 'yang' | 'changing-yin' | 'changing-yang';

export const CoinToss = ({ onComplete, onRestart }: CoinTossProps) => {
  const [currentToss, setCurrentToss] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [lines, setLines] = useState<LineType[]>([]);
  const [coins, setCoins] = useState<('heads' | 'tails')[]>([]);
  const [showResult, setShowResult] = useState(false);

  const tossCoins = () => {
    // Prevent tossing if we already have 6 lines
    if (lines.length >= 6) {
      return;
    }
    
    setIsFlipping(true);
    setShowResult(false);
    
    // Simulate coin tosses with delay
    setTimeout(() => {
      const newCoins: ('heads' | 'tails')[] = [];
      for (let i = 0; i < 3; i++) {
        newCoins.push(Math.random() > 0.5 ? 'heads' : 'tails');
      }
      setCoins(newCoins);
      
      // Calculate line type based on I Ching coin method
      const headsCount = newCoins.filter(coin => coin === 'heads').length;
      let lineType: LineType;
      
      switch (headsCount) {
        case 0: // Three tails (6)
          lineType = 'changing-yin';
          break;
        case 1: // One head, two tails (7)
          lineType = 'yang';
          break;
        case 2: // Two heads, one tail (8)
          lineType = 'yin';
          break;
        case 3: // Three heads (9)
          lineType = 'changing-yang';
          break;
        default:
          lineType = 'yang';
      }
      
      setLines(prev => [...prev, lineType]);
      setIsFlipping(false);
      setShowResult(true);
      
      // Auto-advance after 2 seconds if not the last toss
      if (currentToss < 5) {
        setTimeout(() => {
          setCurrentToss(prev => prev + 1);
          setShowResult(false);
        }, 2000);
      }
    }, 1000);
  };


  const renderLine = (lineType: LineType) => {
    const baseClasses = "w-32 h-6 mx-auto transition-all duration-500";
    
    switch (lineType) {
      case 'yang':
        return <div className={`${baseClasses} bg-primary shadow-oracle`}></div>;
      case 'yin':
        return (
          <div className={`${baseClasses} flex justify-between`}>
            <div className="w-14 h-6 bg-primary shadow-oracle"></div>
            <div className="w-14 h-6 bg-primary shadow-oracle"></div>
          </div>
        );
      case 'changing-yang':
        return <div className={`${baseClasses} bg-accent animate-sacred-pulse shadow-oracle`}></div>;
      case 'changing-yin':
        return (
          <div className={`${baseClasses} flex justify-between animate-sacred-pulse`}>
            <div className="w-14 h-6 bg-accent shadow-oracle"></div>
            <div className="w-14 h-6 bg-accent shadow-oracle"></div>
          </div>
        );
    }
  };

  const getLineName = (lineType: LineType) => {
    switch (lineType) {
      case 'yang':
        return 'unchanging yang';
      case 'yin':
        return 'unchanging yin';
      case 'changing-yang':
        return 'changing yang';
      case 'changing-yin':
        return 'changing yin';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {lines.length < 6 ? 
              `Line ${Math.min(currentToss + 1, 6)} of 6` : 
              `Hexagram Complete`
            }
          </h2>
          <p className="text-muted-foreground">
            {lines.length < 6 ?
              `Toss the three coins to determine this line` :
              `Your hexagram is ready to be revealed`
            }
          </p>
        </div>

        {/* Coins Display */}
        <div className="flex justify-center space-x-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center text-sm font-bold transition-all duration-1000 ${
                  isFlipping ? 'animate-coin-flip' : ''
                } ${coins[index] === 'heads' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
              >
                {!isFlipping && coins.length > 0 ? (coins[index] === 'heads' ? '阳' : '陰') : '?'}
              </div>
              {!isFlipping && coins.length > 0 && (
                <span className="mt-1 text-xs font-semibold">
                  {coins[index] === 'heads' ? 'H' : 'T'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Current Lines Built */}
        <div className="space-y-2">
          <h3 className="text-sm text-muted-foreground">Your hexagram so far:</h3>
          <div className="space-y-1 bg-card/20 rounded-lg p-4">
            {Array.from({ length: 6 }).map((_, index) => {
              const lineIndex = 5 - index; // Reverse index to show bottom-up
              return (
                <div key={index} className="flex items-center justify-center space-x-6">
                  <div className="w-32"> {/* Wider space for line name */}
                    {lines[lineIndex] && (
                      <p className="text-sm italic text-muted-foreground text-right whitespace-nowrap">
                        {getLineName(lines[lineIndex])}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {lines[lineIndex] ? (
                      <div className="animate-hexagram-reveal">
                        {renderLine(lines[lineIndex])}
                      </div>
                    ) : (
                      <div className="w-32 h-6 border border-muted-foreground/30 rounded opacity-30"></div>
                    )}
                  </div>
                  <div className="w-32"> {/* Space for balance */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {lines.length < 6 ? (
            <Button 
              onClick={tossCoins}
              disabled={isFlipping || lines.length >= 6}
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
                onClick={() => {
                  // Pass the full lines array with changing line information
                  onComplete(lines);
                }}
                className="px-8 py-4 text-lg bg-gradient-sacred hover:shadow-oracle transition-all duration-500"
              >
                Reveal Hexagram
              </Button>
            </div>
          )}
          
          {/* Home Button */}
          <div className="mt-8 pt-4 border-t border-muted">
            <Button 
              onClick={() => onRestart ? onRestart() : window.location.reload()}
              variant="outline" 
              size="icon" 
              className="rounded-full h-10 w-10"
              title="Return to Home"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
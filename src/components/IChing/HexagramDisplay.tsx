import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import hexagramsData from '@/data/hexagrams.json';

interface HexagramDisplayProps {
  lines: string[];
  onContinue: (hexagram: any) => void;
  onRestart?: () => void;
}

export const HexagramDisplay = ({ lines, onContinue, onRestart }: HexagramDisplayProps) => {
  const [hexagram, setHexagram] = useState<any>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Find matching hexagram (lines are built bottom to top in I Ching)
    const reversedLines = [...lines].reverse();
    const foundHexagram = hexagramsData.find(h => 
      JSON.stringify(h.lines) === JSON.stringify(reversedLines)
    );
    
    setHexagram(foundHexagram || hexagramsData[0]); // Fallback to first hexagram
    
    setTimeout(() => setIsRevealing(true), 500);
  }, [lines]);

  const renderLine = (lineType: string, index: number) => {
    const baseClasses = "w-20 h-3 mx-auto transition-all duration-700";
    const delay = `${index * 100}ms`;
    
    return (
      <div 
        key={index}
        className={`transform transition-all duration-700 ${
          isRevealing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: delay }}
      >
        {lineType === 'yang' ? (
          <div className={`${baseClasses} bg-primary shadow-oracle`}></div>
        ) : (
          <div className={`${baseClasses} flex justify-between`}>
            <div className="w-8 h-3 bg-primary shadow-oracle"></div>
            <div className="w-8 h-3 bg-primary shadow-oracle"></div>
          </div>
        )}
      </div>
    );
  };

  if (!hexagram) return null;

  return (
    <div className="min-h-screen bg-gradient-cosmic flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Your Hexagram
          </h2>
          <p className="text-muted-foreground">
            The oracle has spoken
          </p>
        </div>

        <Card className="p-8 bg-gradient-ethereal border-primary/20 shadow-cosmic">
          <div className="text-center space-y-6">
            {/* Hexagram Visual */}
            <div className="space-y-2 py-6">
              {[...lines].reverse().map((line, index) => renderLine(line, lines.length - 1 - index))}
            </div>

            {/* Hexagram Info */}
            <div 
              className={`space-y-3 transform transition-all duration-1000 ${
                isRevealing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-primary">
                  {hexagram.number}. {hexagram.name}
                </h3>
                <p className="text-4xl text-accent">{hexagram.chinese}</p>
              </div>

              <div className="space-y-4 text-left">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Judgment:</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {hexagram.judgment}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Image:</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {hexagram.image}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center space-y-4">
          <Button 
            onClick={() => onContinue(hexagram)}
            className="px-8 py-4 text-lg bg-gradient-sacred hover:shadow-oracle transition-all duration-500 hover:scale-105"
          >
            Receive Interpretation
          </Button>
          
          {/* Home Button */}
          <div className="mt-4 pt-2">
            <Button 
              onClick={() => onRestart ? onRestart() : null}
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
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HomeIcon } from 'lucide-react';
import hexagramsData from '@/data/hexagrams.json';

type LineType = 'yin' | 'yang' | 'changing-yin' | 'changing-yang';

interface HexagramDisplayProps {
  lines: LineType[];
  onContinue: (hexagram: any) => void;
  onReset: () => void;
}

export const HexagramDisplay = ({ lines, onContinue, onReset }: HexagramDisplayProps) => {
  const [primaryHexagram, setPrimaryHexagram] = useState<any>(null);
  const [resultingHexagram, setResultingHexagram] = useState<any>(null);
  const [hasChangingLines, setHasChangingLines] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    // Generate simplified lines for primary hexagram (just yin/yang)
    const primaryLines = lines.map(line => 
      line.includes('yang') ? 'yang' : 'yin'
    );

    // Check if there are any changing lines
    const hasChanges = lines.some(line => 
      line === 'changing-yin' || line === 'changing-yang'
    );
    setHasChangingLines(hasChanges);

    // Generate resulting hexagram lines by flipping changing lines
    const resultingLines = lines.map(line => {
      if (line === 'changing-yin') return 'yang';
      if (line === 'changing-yang') return 'yin';
      return line.includes('yang') ? 'yang' : 'yin';
    });

    // Find matching hexagrams (lines are built bottom to top in I Ching)
    const reversedPrimaryLines = [...primaryLines].reverse();
    const foundPrimaryHexagram = hexagramsData.find(h => 
      JSON.stringify(h.lines) === JSON.stringify(reversedPrimaryLines)
    );
    
    setPrimaryHexagram(foundPrimaryHexagram || hexagramsData[0]); // Fallback to first hexagram
    
    // Only find resulting hexagram if there are changing lines
    if (hasChanges) {
      const reversedResultingLines = [...resultingLines].reverse();
      const foundResultingHexagram = hexagramsData.find(h => 
        JSON.stringify(h.lines) === JSON.stringify(reversedResultingLines)
      );
      
      setResultingHexagram(foundResultingHexagram || hexagramsData[0]);
    }
    
    setTimeout(() => setIsRevealing(true), 500);
  }, [lines]);

  const renderLine = (lineType: LineType, index: number, isChanging = false) => {
    const baseClasses = "w-20 h-3 mx-auto transition-all duration-700";
    const delay = `${index * 100}ms`;
    
    // Determine if this is a changing line
    const isChangingLine = lineType === 'changing-yin' || lineType === 'changing-yang';
    
    return (
      <div 
        key={index}
        className={`transform transition-all duration-700 ${
          isRevealing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } relative`}
        style={{ transitionDelay: delay }}
      >
        {/* Line visualization */}
        {lineType.includes('yang') ? (
          <div className={`${baseClasses} ${isChangingLine ? 'bg-accent animate-sacred-pulse' : 'bg-primary'} shadow-oracle`}></div>
        ) : (
          <div className={`${baseClasses} flex justify-between`}>
            <div className={`w-8 h-3 ${isChangingLine ? 'bg-accent animate-sacred-pulse' : 'bg-primary'} shadow-oracle`}></div>
            <div className={`w-8 h-3 ${isChangingLine ? 'bg-accent animate-sacred-pulse' : 'bg-primary'} shadow-oracle`}></div>
          </div>
        )}
        
        {/* Changing line indicator */}
        {isChangingLine && (
          <div className="absolute -right-6 top-0 text-accent animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 18 4-4-4-4"></path>
              <path d="m16 18-4-4 4-4"></path>
            </svg>
          </div>
        )}
      </div>
    );
  };

  // This will be moved to a single function below

  if (!primaryHexagram) return null;

  // Get the changing line meanings
  const getChangingLineMeanings = () => {
    if (!hasChangingLines || !primaryHexagram || !primaryHexagram.lines_meaning) {
      return [];
    }

    const changingLineIndices = lines
      .map((line, idx) => (line === 'changing-yin' || line === 'changing-yang') ? idx + 1 : null)
      .filter(idx => idx !== null);

    return changingLineIndices.map(lineNumber => {
      const meaning = primaryHexagram.lines_meaning[lineNumber - 1] || 
        `Line ${lineNumber} is changing, indicating a shift in this position.`;
      return { lineNumber, meaning };
    });
  };
  
  const changingLineMeanings = getChangingLineMeanings();

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
          {hasChangingLines && (
            <div className="mt-2 text-xs text-accent">
              With {changingLineMeanings.length} changing line{changingLineMeanings.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <Card className="p-8 bg-gradient-ethereal border-primary/20 shadow-cosmic">
          <div className="text-center space-y-6">
            {/* Primary Hexagram */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                {hasChangingLines ? "Your Current State" : "Your Hexagram"}
              </h3>
              
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
                    {primaryHexagram.number}. {primaryHexagram.name}
                  </h3>
                  <p className="text-4xl text-accent">{primaryHexagram.chinese}</p>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Judgment:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {primaryHexagram.judgment}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Image:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {primaryHexagram.image}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Changing Line Meanings */}
            {changingLineMeanings.length > 0 && (
              <div className="pt-4 mt-4 border-t border-primary/20">
                <h4 className="font-semibold text-foreground mb-3">Changing Line Meanings:</h4>
                <div className="space-y-3 text-left">
                  {changingLineMeanings.map(({ lineNumber, meaning }) => (
                    <div key={lineNumber} className="bg-muted/20 rounded p-3">
                      <p className="text-sm font-medium mb-1">Line {lineNumber}:</p>
                      <p className="text-sm text-muted-foreground">{meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Resulting Hexagram */}
            {hasChangingLines && resultingHexagram && (
              <div className="pt-6 mt-6 border-t border-primary/20">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  What is Emerging
                </h3>
                
                {/* Resulting Hexagram Visual */}
                <div className="space-y-2 py-6">
                  {[...lines].reverse().map((line, index) => {
                    const lineIndex = lines.length - 1 - index;
                    const isChangingLine = line === 'changing-yin' || line === 'changing-yang';
                    const resultingLineType = isChangingLine ? 
                      (line === 'changing-yin' ? 'yang' : 'yin') : 
                      (line.includes('yang') ? 'yang' : 'yin');
                    
                    return renderLine(resultingLineType, lineIndex, false);
                  })}
                </div>
                
                {/* Resulting Hexagram Info */}
                <div className={`space-y-3 transform transition-all duration-1000 ${
                  isRevealing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '1000ms' }}>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-primary">
                      {resultingHexagram.number}. {resultingHexagram.name}
                    </h3>
                    <p className="text-3xl text-accent">{resultingHexagram.chinese}</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Judgment:</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {resultingHexagram.judgment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="text-center space-y-4">
          <Button 
            onClick={() => onContinue(hasChangingLines ? { primary: primaryHexagram, resulting: resultingHexagram } : primaryHexagram)}
            className="px-8 py-4 text-lg bg-gradient-sacred hover:shadow-oracle transition-all duration-500 hover:scale-105"
          >
            Receive Interpretation
          </Button>
          <Button 
            onClick={() => onReset()}
            variant="ghost"
            className="mt-2"
          >
            <HomeIcon className="h-5 w-5 mr-1" /> Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};
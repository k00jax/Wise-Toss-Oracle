import { useState, useEffect } from 'react';
import { OracleIntro } from './OracleIntro';
import { CoinToss } from './CoinToss';
import { HexagramDisplay } from './HexagramDisplay';
import { OracleInterpretation } from './OracleInterpretation';

type AppState = 'intro' | 'tossing' | 'hexagram' | 'interpretation';

export const OracleApp = () => {
  const [state, setState] = useState<AppState>('intro');
  const [lines, setLines] = useState<string[]>([]);
  const [hexagram, setHexagram] = useState<any>(null);

  const handleBegin = () => {
    setState('tossing');
  };

  const handleTossComplete = (generatedLines: string[]) => {
    setLines(generatedLines);
    setState('hexagram');
  };

  const handleContinueToInterpretation = (selectedHexagram: any) => {
    setHexagram(selectedHexagram);
    setState('interpretation');
  };

  const handleRestart = () => {
    setState('intro');
    setLines([]);
    setHexagram(null);
  };

  switch (state) {
    case 'intro':
      return <OracleIntro onBegin={handleBegin} />;
    
    case 'tossing':
      return <CoinToss onComplete={handleTossComplete} onRestart={handleRestart} />;
    
    case 'hexagram':
      return <HexagramDisplay lines={lines} onContinue={handleContinueToInterpretation} onRestart={handleRestart} />;
    
    case 'interpretation':
      return <OracleInterpretation hexagram={hexagram} onRestart={handleRestart} />;
    
    default:
      return <OracleIntro onBegin={handleBegin} />;
  }
};
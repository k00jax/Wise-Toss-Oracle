import { useState, useEffect } from 'react';
import { OracleIntro } from './OracleIntro';
import { CoinToss } from './CoinToss';
import { HexagramDisplay } from './HexagramDisplay';
import { OracleInterpretation } from './OracleInterpretation';
import { DailyOracle } from './DailyOracle';
import { ReadingHistoryPanel } from './ReadingHistoryPanel';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

type AppState = 'intro' | 'tossing' | 'hexagram' | 'interpretation' | 'history';

export const OracleApp = () => {
  const [state, setState] = useState<AppState>('intro');
  const [lines, setLines] = useState<('yin' | 'yang' | 'changing-yin' | 'changing-yang')[]>([]);
  const [hexagram, setHexagram] = useState<any>(null);
  const [interpretation, setInterpretation] = useState<string>('');

  const handleBegin = () => {
    setState('tossing');
  };

  const handleTossComplete = (generatedLines: ('yin' | 'yang' | 'changing-yin' | 'changing-yang')[]) => {
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
    setInterpretation('');
  };

  const handleViewHistory = () => {
    setState('history');
  };

  const handleInterpretationGenerated = (interpretationText: string) => {
    setInterpretation(interpretationText);
  };

  return (
    <SubscriptionProvider>
      <DailyOracle />
      
      {(() => {
        switch (state) {
          case 'intro':
            return <OracleIntro onBegin={handleBegin} onViewHistory={handleViewHistory} />;
          
          case 'tossing':
            return <CoinToss onComplete={handleTossComplete} onRestart={handleRestart} />;
          
          case 'hexagram':
            return <HexagramDisplay 
              lines={lines} 
              onContinue={handleContinueToInterpretation} 
              onReset={handleRestart}
            />;
          
          case 'interpretation':
            return <OracleInterpretation 
              hexagram={hexagram} 
              onRestart={handleRestart}
              onViewHistory={handleViewHistory}
              onInterpretationGenerated={handleInterpretationGenerated}
              reading={{
                id: Date.now().toString(),
                date: new Date().toISOString(),
                hexagramNumber: hexagram?.primary ? hexagram.primary.number : hexagram?.number,
                hexagramName: hexagram?.primary ? hexagram.primary.name : hexagram?.name,
                hexagramChinese: hexagram?.primary ? hexagram.primary.chinese : hexagram?.chinese,
                resultingHexagramNumber: hexagram?.resulting?.number,
                resultingHexagramName: hexagram?.resulting?.name,
                interpretation: interpretation,
                lines: lines
              }}
            />;

          case 'history':
            return (
              <div className="min-h-screen bg-gradient-cosmic p-6">
                <div className="max-w-2xl mx-auto">
                  <button 
                    className="text-sm text-accent mb-4 flex items-center"
                    onClick={handleRestart}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 mr-1"
                    >
                      <path d="m12 19-7-7 7-7"/>
                      <path d="M19 12H5"/>
                    </svg>
                    Back to Oracle
                  </button>
                  
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Your Oracle Journey
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-ethereal p-6 rounded-lg border border-primary/20 shadow-oracle">
                      <p className="text-muted-foreground text-sm italic">
                        "Your past readings are guides for the future. Review your journey and the wisdom gained along the way."
                      </p>
                    </div>
                    
                    <ReadingHistoryPanel />
                  </div>
                </div>
              </div>
            );
          
          default:
            return <OracleIntro onBegin={handleBegin} onViewHistory={handleViewHistory} />;
        }
      })()}
    </SubscriptionProvider>
  );
};
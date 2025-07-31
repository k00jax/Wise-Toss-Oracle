import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import hexagramsData from '@/data/hexagrams.json';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const DailyOracle = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [dailyHexagram, setDailyHexagram] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get today's date
  const today = new Date().toDateString();
  
  useEffect(() => {
    const storedDate = localStorage.getItem('dailyOracleDate');
    const storedHexagram = localStorage.getItem('dailyOracle');
    
    if (storedDate === today && storedHexagram) {
      setDailyHexagram(JSON.parse(storedHexagram));
      setIsLoading(false);
    } else {
      // Generate a new daily hexagram
      const randomIndex = Math.floor(Math.random() * hexagramsData.length);
      const newDailyHexagram = hexagramsData[randomIndex];
      
      // Store in localStorage
      localStorage.setItem('dailyOracleDate', today);
      localStorage.setItem('dailyOracle', JSON.stringify(newDailyHexagram));
      
      setDailyHexagram(newDailyHexagram);
      setIsLoading(false);
    }
    
    // Check if the user has already dismissed today's oracle
    const dismissedDate = localStorage.getItem('dailyOracleDismissed');
    if (dismissedDate === today) {
      setIsDismissed(true);
    }
  }, [today]);
  
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dailyOracleDismissed', today);
  };
  
  if (isLoading || isDismissed || !dailyHexagram) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="p-4 bg-gradient-ethereal border-accent/30 shadow-oracle overflow-hidden">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-sm font-semibold text-primary">Today's Oracle</h4>
            <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="space-y-1">
            {dailyHexagram.lines.map((line: string, index: number) => {
              const baseClasses = "w-8 h-1 transition-all";
              return (
                <div key={index}>
                  {line === 'yang' ? (
                    <div className={`${baseClasses} bg-primary`}></div>
                  ) : (
                    <div className={`${baseClasses} flex justify-between`}>
                      <div className="w-3 h-1 bg-primary"></div>
                      <div className="w-3 h-1 bg-primary"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div>
            <h5 className="text-sm font-bold">{dailyHexagram.number}. {dailyHexagram.name}</h5>
            <p className="text-xs text-muted-foreground mt-1">{dailyHexagram.judgment.substring(0, 60)}...</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

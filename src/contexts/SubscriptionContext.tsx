import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ReadingHistory {
  id: string;
  date: string;
  hexagramNumber: number;
  hexagramName: string;
  hexagramChinese: string;
  resultingHexagramNumber?: number;
  resultingHexagramName?: string;
  interpretation: string;
  journal?: string;
  lines: string[];
}

interface SubscriptionContextType {
  isSubscribed: boolean;
  setIsSubscribed: (value: boolean) => void;
  dailyReadingsCount: number;
  incrementDailyReadings: () => void;
  readingHistory: ReadingHistory[];
  addToHistory: (reading: ReadingHistory) => void;
  updateJournal: (id: string, journal: string) => void;
  dailyOracleHexagram: any | null;
  remainingReads: number;
}

const MAX_FREE_READINGS_PER_DAY = 1;

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dailyReadingsCount, setDailyReadingsCount] = useState(0);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);
  const [dailyOracleHexagram, setDailyOracleHexagram] = useState<any | null>(null);
  
  // Load subscription status from localStorage
  useEffect(() => {
    const storedSubscription = localStorage.getItem('isSubscribed');
    if (storedSubscription) {
      setIsSubscribed(storedSubscription === 'true');
    }
    
    // Load reading history if subscribed
    if (isSubscribed) {
      const storedHistory = localStorage.getItem('readingHistory');
      if (storedHistory) {
        setReadingHistory(JSON.parse(storedHistory));
      }
    }
    
    // Check if we need to reset daily count
    const lastReadDate = localStorage.getItem('lastReadDate');
    const today = new Date().toDateString();
    
    if (lastReadDate !== today) {
      // Reset daily count
      localStorage.setItem('dailyReadingsCount', '0');
      localStorage.setItem('lastReadDate', today);
      setDailyReadingsCount(0);
    } else {
      // Load current daily count
      const storedCount = localStorage.getItem('dailyReadingsCount');
      if (storedCount) {
        setDailyReadingsCount(parseInt(storedCount, 10));
      }
    }
    
    // Check or set daily oracle
    const dailyOracleDate = localStorage.getItem('dailyOracleDate');
    if (dailyOracleDate !== today) {
      // Will be set when app fully loads, with hexagram data available
      localStorage.setItem('dailyOracleDate', today);
    } else {
      // Load existing daily oracle
      const storedOracle = localStorage.getItem('dailyOracle');
      if (storedOracle) {
        setDailyOracleHexagram(JSON.parse(storedOracle));
      }
    }
  }, []);
  
  // Save subscription status to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('isSubscribed', isSubscribed.toString());
  }, [isSubscribed]);
  
  // Save reading history to localStorage when it changes
  useEffect(() => {
    if (isSubscribed) {
      localStorage.setItem('readingHistory', JSON.stringify(readingHistory));
    }
  }, [readingHistory, isSubscribed]);
  
  const incrementDailyReadings = () => {
    const newCount = dailyReadingsCount + 1;
    setDailyReadingsCount(newCount);
    localStorage.setItem('dailyReadingsCount', newCount.toString());
    localStorage.setItem('lastReadDate', new Date().toDateString());
  };
  
  const addToHistory = (reading: ReadingHistory) => {
    if (isSubscribed) {
      setReadingHistory(prev => [reading, ...prev]);
    }
  };
  
  const updateJournal = (id: string, journal: string) => {
    if (isSubscribed) {
      setReadingHistory(prev => 
        prev.map(reading => 
          reading.id === id ? { ...reading, journal } : reading
        )
      );
    }
  };
  
  const remainingReads = MAX_FREE_READINGS_PER_DAY - dailyReadingsCount;
  
  return (
    <SubscriptionContext.Provider 
      value={{ 
        isSubscribed, 
        setIsSubscribed, 
        dailyReadingsCount,
        incrementDailyReadings,
        readingHistory,
        addToHistory,
        updateJournal,
        dailyOracleHexagram,
        remainingReads
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

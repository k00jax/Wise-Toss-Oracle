import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useSubscription, ReadingHistory } from '@/contexts/SubscriptionContext';

export const ReadingHistoryPanel = () => {
  const { readingHistory, updateJournal, isSubscribed } = useSubscription();
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(null);
  
  const handleExpandReading = (id: string) => {
    if (expandedReadingId === id) {
      setExpandedReadingId(null);
    } else {
      setExpandedReadingId(id);
    }
  };
  
  const handleJournalChange = (id: string, journal: string) => {
    updateJournal(id, journal);
  };
  
  if (!isSubscribed) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Your Reading History</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Subscribe to unlock personal reading history and journal features
            </p>
          </div>
        </div>
      </Card>
    );
  }
  
  if (readingHistory.length === 0) {
    return (
      <Card className="p-6 bg-card border-primary/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Your Reading History</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete a reading to see your history here
            </p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-card border-primary/20">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-foreground flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Your Reading History</span>
        </h3>
        <p className="text-sm text-muted-foreground">
          Your previous consultations and personal journal
        </p>
      </div>
      
      <div className="divide-y mt-4">
        {readingHistory.map((reading) => (
          <div key={reading.id} className="py-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleExpandReading(reading.id)}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {reading.hexagramNumber}. {reading.hexagramName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {reading.hexagramChinese}
                  </span>
                  {reading.resultingHexagramNumber && (
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                      → {reading.resultingHexagramNumber}. {reading.resultingHexagramName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(reading.date).toLocaleDateString()}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {expandedReadingId === reading.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {expandedReadingId === reading.id && (
              <div className="mt-4 space-y-3 pt-3 border-t border-muted/30">
                <div>
                  <h5 className="text-xs font-semibold mb-1">Interpretation</h5>
                  <p className="text-sm text-muted-foreground">
                    {reading.interpretation}
                  </p>
                </div>
                
                <div>
                  <h5 className="text-xs font-semibold mb-1">Your Journal</h5>
                  <Textarea
                    placeholder="Write your reflections here..."
                    className="text-sm min-h-[100px] bg-muted/20"
                    value={reading.journal || ''}
                    onChange={(e) => handleJournalChange(reading.id, e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

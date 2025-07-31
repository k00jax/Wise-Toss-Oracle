import { Sparkles } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PremiumBadge = () => {
  const { isSubscribed, remainingReads } = useSubscription();

  if (isSubscribed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center px-2 py-0.5 rounded-full bg-gradient-sacred text-xs font-medium">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">You have unlimited readings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center px-2 py-0.5 rounded-full bg-muted/30 text-xs font-medium text-muted-foreground">
            <span>{remainingReads}</span>
            <span className="ml-1">reading{remainingReads !== 1 ? 's' : ''} left today</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Subscribe for unlimited readings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

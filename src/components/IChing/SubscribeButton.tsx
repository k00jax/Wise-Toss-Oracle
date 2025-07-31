import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const SubscribeButton = () => {
  const { isSubscribed, setIsSubscribed } = useSubscription();

  const handleSubscribeClick = () => {
    // In a real app, this would launch Stripe/PayPal flow
    setIsSubscribed(!isSubscribed);
    
    if (!isSubscribed) {
      // Simulating successful subscription
      alert('Thank you for subscribing! You now have unlimited access.');
    }
  };

  if (isSubscribed) {
    return (
      <Button 
        onClick={handleSubscribeClick}
        variant="outline" 
        className="flex items-center space-x-1 text-sm border-accent/40 hover:bg-accent/10"
      >
        <Sparkles className="w-4 h-4 text-accent" />
        <span>Premium Active</span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleSubscribeClick}
      className="flex items-center space-x-1 text-sm bg-gradient-sacred"
    >
      <Sparkles className="w-4 h-4" />
      <span>Subscribe for Unlimited Access</span>
    </Button>
  );
};

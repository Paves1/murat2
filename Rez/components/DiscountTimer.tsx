import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DiscountTimerProps {
  onApplyDiscount: () => void;
  onDiscountExpire: () => void;
}

export function DiscountTimer({ onApplyDiscount, onDiscountExpire }: DiscountTimerProps) {
  const [timeLeft, setTimeLeft] = useState(240); // 4 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onDiscountExpire();
    }
  }, [timeLeft, onDiscountExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="fixed right-4 top-20 w-64 bg-violet-100 border-violet-300 z-50">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-violet-800 mb-2">Özel İndirim!</h3>
        <p className="text-sm text-violet-600 mb-2">%10 indirim için kalan süre:</p>
        <p className="text-2xl font-bold text-violet-800 mb-4">{minutes}:{seconds.toString().padStart(2, '0')}</p>
        <Button onClick={onApplyDiscount} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
          İndirimi Uygula
        </Button>
      </CardContent>
    </Card>
  );
}


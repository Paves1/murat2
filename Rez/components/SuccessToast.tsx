import React from 'react';
import { CheckCircle } from 'lucide-react';

export const SuccessToast: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-lg">
      <div className="flex-shrink-0 text-emerald-500">
        <CheckCircle className="h-6 w-6 animate-bounce" />
      </div>
      <div>
        <h3 className="font-semibold text-emerald-800">Rezervasyon Talebiniz Alındı</h3>
        <p className="text-emerald-600 text-sm">En kısa zamanda size geri döneceğiz.</p>
      </div>
    </div>
  );
};


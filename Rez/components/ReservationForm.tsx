import React, { useState } from 'react';
import { useReservationStore } from '../store/reservationStore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReservationFormProps {
  startDate: Date;
  endDate: Date;
  guestCount: number;
  onSuccess: () => void;
  totalPrice: number;
  isDiscounted: boolean;
}

export function ReservationForm({ startDate, endDate, guestCount, onSuccess, totalPrice, isDiscounted }: ReservationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { addReservation } = useReservationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation = {
      id: Date.now().toString(),
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      startDate,
      endDate,
      guestCount,
      status: 'pending',
      paymentStatus: 'pending',
      paidAmount: 0,
      totalPrice,
      isDiscounted,
      createdAt: new Date(), // Şu anki tarih ve saati ekliyoruz
    };
    addReservation(newReservation);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Ad Soyad</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefon</Label>
        <Input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Rezervasyon Yap
      </Button>
    </form>
  );
}


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';

interface DynamicPrice {
  startDate: Date;
  endDate: Date;
  price: number;
}

interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentStatus: 'pending' | 'partial' | 'completed';
  paidAmount: number;
  totalPrice: number;
  isDiscounted: boolean;
  createdAt: Date;
}

interface ReservationStore {
  reservations: Reservation[];
  blockedDates: Date[];
  dynamicPrices: DynamicPrice[];
  addReservation: (reservation: Reservation) => void;
  toggleDateAvailability: (date: Date) => void;
  isDateAvailable: (date: Date) => boolean;
  updateReservationStatus: (id: string, status: 'approved' | 'rejected') => void;
  getPendingReservations: () => Reservation[];
  getDiscountedReservations: () => Reservation[];
  getNonDiscountedReservations: () => Reservation[];
  getBlockedDates: () => Date[];
  refreshBlockedDates: () => void;
  addDynamicPrice: (dynamicPrice: DynamicPrice) => void;
  removeDynamicPrice: (index: number) => void;
  getDynamicPrices: () => DynamicPrice[];
  getPriceForDate: (date: Date) => number;
}

const DEFAULT_PRICE = 3500; // Varsayılan günlük fiyat

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      reservations: [],
      blockedDates: [],
      dynamicPrices: [],
      addReservation: (reservation) =>
        set((state) => {
          const newReservation = {
            ...reservation,
            startDate: new Date(reservation.startDate),
            endDate: new Date(reservation.endDate),
            createdAt: new Date()
          };
          return { reservations: [...state.reservations, newReservation] };
        }),
      toggleDateAvailability: (date) =>
        set((state) => {
          const isBlocked = state.blockedDates.some((d) => isSameDay(new Date(d), new Date(date)));
          if (isBlocked) {
            return { blockedDates: state.blockedDates.filter((d) => !isSameDay(new Date(d), new Date(date))) };
          } else {
            return { blockedDates: [...state.blockedDates, date] };
          }
        }),
      isDateAvailable: (date) => {
        const state = get();
        return !state.blockedDates.some((d) => isSameDay(new Date(d), new Date(date)));
      },
      updateReservationStatus: (id, status) =>
        set((state) => {
          const updatedReservations = state.reservations.map((res) =>
            res.id === id ? { ...res, status } : res
          );
          let newBlockedDates = [...state.blockedDates];
          if (status === 'approved') {
            const approvedReservation = updatedReservations.find((res) => res.id === id);
            if (approvedReservation) {
              const datesToBlock = eachDayOfInterval({
                start: new Date(approvedReservation.startDate),
                end: new Date(approvedReservation.endDate)
              });
              newBlockedDates = [...newBlockedDates, ...datesToBlock];
            }
          }
          return {
            reservations: updatedReservations,
            blockedDates: newBlockedDates,
          };
        }),
      getPendingReservations: () => {
        const state = get();
        return state.reservations.filter((res) => res.status === 'pending');
      },
      getDiscountedReservations: () => {
        const state = get();
        return state.reservations.filter((res) => res.isDiscounted);
      },
      getNonDiscountedReservations: () => {
        const state = get();
        return state.reservations.filter((res) => !res.isDiscounted);
      },
      getBlockedDates: () => {
        const state = get();
        return state.blockedDates.map(d => new Date(d));
      },
      refreshBlockedDates: () => {
        set((state) => {
          const newBlockedDates = state.reservations
            .filter((res) => res.status === 'approved')
            .flatMap((res) =>
              eachDayOfInterval({
                start: new Date(res.startDate),
                end: new Date(res.endDate)
              })
            );
          return { blockedDates: newBlockedDates };
        });
      },
      addDynamicPrice: (dynamicPrice) =>
        set((state) => ({
          dynamicPrices: [...state.dynamicPrices, dynamicPrice]
        })),
      removeDynamicPrice: (index) =>
        set((state) => ({
          dynamicPrices: state.dynamicPrices.filter((_, i) => i !== index)
        })),
      getDynamicPrices: () => {
        const state = get();
        return state.dynamicPrices;
      },
      getPriceForDate: (date) => {
        const state = get();
        const dynamicPrice = state.dynamicPrices.find(dp => 
          isWithinInterval(date, { start: new Date(dp.startDate), end: new Date(dp.endDate) })
        );
        return dynamicPrice ? dynamicPrice.price : DEFAULT_PRICE;
      },
    }),
    {
      name: 'reservation-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            ...data,
            state: {
              ...data.state,
              blockedDates: data.state.blockedDates.map((d: string) => new Date(d)),
              reservations: data.state.reservations.map((r: any) => ({
                ...r,
                startDate: new Date(r.startDate),
                endDate: new Date(r.endDate),
                createdAt: new Date(r.createdAt)
              })),
              dynamicPrices: data.state.dynamicPrices.map((dp: any) => ({
                ...dp,
                startDate: new Date(dp.startDate),
                endDate: new Date(dp.endDate)
              }))
            }
          };
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);


"use client"

import React, { useState, useEffect } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useReservationStore } from '../store/reservationStore';
import { Calendar, Users, DollarSign, CheckCircle, XCircle, Clock, BarChart, Settings, Phone, Mail, Download, Filter, Menu, Code, Home, LogOut, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ReservationCalendar } from './calendar/reservation-calendar';

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

const ReservationTable: React.FC<{ reservations: Reservation[], handleStatusUpdate: (id: string, status: 'approved' | 'rejected') => void }> = ({ reservations, handleStatusUpdate }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Müşteri</TableHead>
            <TableHead className="text-primary">Tarih</TableHead>
            <TableHead className="text-primary">Durum</TableHead>
            <TableHead className="text-primary">İndirim</TableHead>
            <TableHead className="text-primary">Talep Tarihi</TableHead>
            <TableHead className="text-primary">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.customerName}</TableCell>
              <TableCell>
                {format(new Date(reservation.startDate), 'dd.MM.yyyy')} -{' '}
                {format(new Date(reservation.endDate), 'dd.MM.yyyy')}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    reservation.status === 'approved'
                      ? 'success'
                      : reservation.status === 'rejected'
                      ? 'destructive'
                      : 'default'
                  }
                  className={
                    reservation.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {reservation.status === 'approved'
                    ? 'Onaylandı'
                    : reservation.status === 'rejected'
                    ? 'Reddedildi'
                    : 'Beklemede'}
                </Badge>
              </TableCell>
              <TableCell>
                {reservation.isDiscounted ? (
                  <Badge variant="success" className="bg-blue-100 text-blue-800">
                    İndirimli
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    İndirimsiz
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(reservation.createdAt), 'dd.MM.yyyy HH:mm', { locale: tr })}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Detaylar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rezervasyon Detayları</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Müşteri:</span>
                          <span>{reservation.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">E-posta:</span>
                          <span>{reservation.customerEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Telefon:</span>
                          <span>{reservation.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Tarih:</span>
                          <span>
                            {format(new Date(reservation.startDate), 'dd.MM.yyyy')} -{' '}
                            {format(new Date(reservation.endDate), 'dd.MM.yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Kişi Sayısı:</span>
                          <span>{reservation.guestCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Toplam Fiyat:</span>
                          <span>{reservation.totalPrice.toLocaleString('tr-TR')} ₺</span>
                        </div>
                      </div>
                      {reservation.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <Button onClick={() => handleStatusUpdate(reservation.id, 'approved')} className="bg-green-600 hover:bg-green-700">
                            Onayla
                          </Button>
                          <Button onClick={() => handleStatusUpdate(reservation.id, 'rejected')} variant="destructive">
                            Reddet
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const CustomerTable: React.FC<{ customers: Reservation[] }> = ({ customers }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Müşteri Adı</TableHead>
            <TableHead className="text-primary">E-posta</TableHead>
            <TableHead className="text-primary">Telefon</TableHead>
            <TableHead className="text-primary">Konaklama Tarihleri</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.customerName}</TableCell>
              <TableCell>{customer.customerEmail}</TableCell>
              <TableCell>{customer.customerPhone}</TableCell>
              <TableCell>
                {format(new Date(customer.startDate), 'dd.MM.yyyy')} -{' '}
                {format(new Date(customer.endDate), 'dd.MM.yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export function AdminDashboard() {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const { reservations, toggleDateAvailability, updateReservationStatus, getPendingReservations, getDiscountedReservations, getNonDiscountedReservations, getBlockedDates, refreshBlockedDates, addDynamicPrice, removeDynamicPrice, getDynamicPrices } = useReservationStore();
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [discountedReservations, setDiscountedReservations] = useState<Reservation[]>([]);
  const [nonDiscountedReservations, setNonDiscountedReservations] = useState<Reservation[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>(reservations);
  const [selectedRange, setSelectedRange] = useState<{ start?: Date; end?: Date }>({});
  const [activeTab, setActiveTab] = useState("all");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [approvedReservationsCount, setApprovedReservationsCount] = useState(0);
  const [averageReservationValue, setAverageReservationValue] = useState(0);

  const [newDynamicPrice, setNewDynamicPrice] = useState({
    startDate: '',
    endDate: '',
    price: 0
  });
  const [dynamicPrices, setDynamicPrices] = useState(getDynamicPrices());

  useEffect(() => {
    refreshBlockedDates();
    setBlockedDates(getBlockedDates());
    setPendingReservations(getPendingReservations());
    setDiscountedReservations(getDiscountedReservations());
    setNonDiscountedReservations(getNonDiscountedReservations());
    calculateReservationStats();
  }, [refreshBlockedDates, getBlockedDates, getPendingReservations, getDiscountedReservations, getNonDiscountedReservations, reservations]);

  useEffect(() => {
    setFilteredReservations(
      reservations.filter((reservation) => {
        if (filterStartDate && filterEndDate) {
          return isWithinInterval(new Date(reservation.startDate), {
            start: filterStartDate,
            end: filterEndDate,
          });
        }
        return true;
      })
    );
  }, [reservations, filterStartDate, filterEndDate]);

  const handleDateToggle = (date: Date) => {
    toggleDateAvailability(date);
    setBlockedDates(getBlockedDates());
  };

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    updateReservationStatus(id, status);
    setPendingReservations(getPendingReservations());
    setDiscountedReservations(getDiscountedReservations());
    setNonDiscountedReservations(getNonDiscountedReservations());
    setFilteredReservations(reservations);
    calculateReservationStats();
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Müşteri Adı', 'E-posta', 'Telefon', 'Başlangıç Tarihi', 'Bitiş Tarihi', 'Kişi Sayısı', 'Durum', 'Ödeme Durumu', 'Ödenen Miktar', 'Toplam Fiyat', 'İndirimli', 'Talep Tarihi'],
      ...filteredReservations.map((r) => [
        r.id,
        r.customerName,
        r.customerEmail,
        r.customerPhone,
        format(new Date(r.startDate), 'dd.MM.yyyy'),
        format(new Date(r.endDate), 'dd.MM.yyyy'),
        r.guestCount,
        r.status,
        r.paymentStatus,
        r.paidAmount,
        r.totalPrice,
        r.isDiscounted ? 'Evet' : 'Hayır',
        format(new Date(r.createdAt), 'dd.MM.yyyy HH:mm', { locale: tr }),
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'reservations.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const calculateReservationStats = () => {
    const approvedReservations = reservations.filter(r => r.status === 'approved');
    const totalRevenue = approvedReservations.reduce((sum, r) => sum + r.totalPrice, 0);
    const count = approvedReservations.length;
    
    setTotalRevenue(totalRevenue);
    setApprovedReservationsCount(count);
    setAverageReservationValue(count > 0 ? totalRevenue / count : 0);
  };

  const handleAddDynamicPrice = () => {
    if (newDynamicPrice.startDate && newDynamicPrice.endDate && newDynamicPrice.price) {
      addDynamicPrice({
        startDate: new Date(newDynamicPrice.startDate),
        endDate: new Date(newDynamicPrice.endDate),
        price: Number(newDynamicPrice.price)
      });
      setNewDynamicPrice({ startDate: '', endDate: '', price: 0 });
      setDynamicPrices(getDynamicPrices());
    }
  };

  const handleRemoveDynamicPrice = (index: number) => {
    removeD
ynamicPrice(index);
    setDynamicPrices(getDynamicPrices());
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sol Sidebar */}
      <div className="w-64 bg-gray-100 p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">VoynHouse Admin</h2>
        <Button 
          variant={activeTab === "all" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("all")}
        >
          <Home className="mr-2 h-4 w-4" />
          Tüm Rezervasyonlar
        </Button>
        <Button 
          variant={activeTab === "discounted" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("discounted")}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          İndirimli Rezervasyonlar
        </Button>
        <Button 
          variant={activeTab === "non-discounted" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("non-discounted")}
        >
          <XCircle className="mr-2 h-4 w-4" />
          İndirimsiz Rezervasyonlar
        </Button>
        <Button 
          variant={activeTab === "customers" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("customers")}
        >
          <Users className="mr-2 h-4 w-4" />
          Müşteriler
        </Button>
        <Button 
          variant={activeTab === "calendar" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("calendar")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Takvim
        </Button>
        <Button 
          variant={activeTab === "dynamic-pricing" ? "default" : "ghost"} 
          className="w-full justify-start" 
          onClick={() => setActiveTab("dynamic-pricing")}
        >
          <BarChart className="mr-2 h-4 w-4" />
          Dinamik Fiyatlandırma
        </Button>
      </div>

      {/* Ana İçerik */}
      <main className="flex-1 p-6 space-y-8">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium">Toplam Gelir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {totalRevenue.toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-blue-100 text-xs mt-1">Son 30 gün</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium">Onaylı Rezervasyonlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {approvedReservationsCount}
                </div>
                <p className="text-green-100 text-xs mt-1">Aktif rezervasyon</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-medium">Ortalama Değer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {averageReservationValue.toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-purple-100 text-xs mt-1">Rezervasyon başına</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                {activeTab === "all" && "Tüm Rezervasyonlar"}
                {activeTab === "discounted" && "İndirimli Rezervasyonlar"}
                {activeTab === "non-discounted" && "İndirimsiz Rezervasyonlar"}
                {activeTab === "customers" && "Müşteriler"}
                {activeTab === "calendar" && "Takvim"}
                {activeTab === "dynamic-pricing" && "Dinamik Fiyatlandırma"}
              </CardTitle>
              {activeTab !== "calendar" && activeTab !== "dynamic-pricing" && (
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV İndir
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {activeTab === "all" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex flex-1 items-center space-x-2">
                      <Input
                        type="date"
                        onChange={(e) => setFilterStartDate(e.target.value ? new Date(e.target.value) : null)}
                        className="max-w-[180px]"
                      />
                      <Input
                        type="date"
                        onChange={(e) => setFilterEndDate(e.target.value ? new Date(e.target.value) : null)}
                        className="max-w-[180px]"
                      />
                      <Button variant="outline" onClick={() => setFilteredReservations(reservations)}>
                        <Filter className="mr-2 h-4 w-4" />
                        Temizle
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="h-[600px]">
                    <ReservationTable
                      reservations={filteredReservations}
                      handleStatusUpdate={handleStatusUpdate}
                    />
                  </ScrollArea>
                </div>
              )}
              {activeTab === "discounted" && (
                <ScrollArea className="h-[600px]">
                  <ReservationTable
                    reservations={discountedReservations}
                    handleStatusUpdate={handleStatusUpdate}
                  />
                </ScrollArea>
              )}
              {activeTab === "non-discounted" && (
                <ScrollArea className="h-[600px]">
                  <ReservationTable
                    reservations={nonDiscountedReservations}
                    handleStatusUpdate={handleStatusUpdate}
                  />
                </ScrollArea>
              )}
              {activeTab === "customers" && (
                <ScrollArea className="h-[600px]">
                  <CustomerTable customers={reservations} />
                </ScrollArea>
              )}
              {activeTab === "calendar" && (
                <ReservationCalendar
                  selectedRange={selectedRange}
                  onRangeChange={setSelectedRange}
                  disabledDates={blockedDates}
                />
              )}
              {activeTab === "dynamic-pricing" && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newDynamicPrice.startDate}
                          onChange={(e) => setNewDynamicPrice({ ...newDynamicPrice, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">Bitiş Tarihi</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={newDynamicPrice.endDate}
                          onChange={(e) => setNewDynamicPrice({ ...newDynamicPrice, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Fiyat (₺)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newDynamicPrice.price}
                        onChange={(e) => setNewDynamicPrice({ ...newDynamicPrice, price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddDynamicPrice} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Fiyat Ekle
                  </Button>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tarih Aralığı</TableHead>
                          <TableHead>Fiyat</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dynamicPrices.map((price, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {format(new Date(price.startDate), 'dd.MM.yyyy')} -{' '}
                              {format(new Date(price.endDate), 'dd.MM.yyyy')}
                            </TableCell>
                            <TableCell>{price.price.toLocaleString('tr-TR')} ₺</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveDynamicPrice(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


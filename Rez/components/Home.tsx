import React, { useState, useEffect } from 'react';
import { tr } from 'date-fns/locale';
import { differenceInDays, format, isSameDay, isAfter, eachDayOfInterval } from 'date-fns';
import { HomeIcon, Users, Calendar, Phone, Mail, MapPin, ChevronDown, Star } from 'lucide-react';
import { useReservationStore } from '../store/reservationStore';
import { ReservationForm } from './ReservationForm';
import { DiscountTimer } from './DiscountTimer';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ReservationCalendar } from './calendar/reservation-calendar';

export function Home() {
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [guests, setGuests] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDiscountNotification, setShowDiscountNotification] = useState(false);
  const [showDiscountTimer, setShowDiscountTimer] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const defaultDailyRate = 3500;

  const { isDateAvailable, getBlockedDates, refreshBlockedDates, getPriceForDate, getDynamicPrices } = useReservationStore();
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        await refreshBlockedDates();
        const dates = getBlockedDates();
        console.log('Blocked dates:', dates);
        setBlockedDates(dates);
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
        toast({
          title: "Hata",
          description: "Tarih bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    };
    fetchBlockedDates();

    const discountNotificationTimer = setTimeout(() => {
      setShowDiscountNotification(true);
    }, 30000);

    return () => clearTimeout(discountNotificationTimer);
  }, [refreshBlockedDates, getBlockedDates, toast]);

  const calculateTotalPrice = () => {
    if (!range.from || !range.to) return 0;

    const days = eachDayOfInterval({ start: range.from, end: range.to });
    const totalPrice = days.reduce((sum, day) => sum + getPriceForDate(day), 0);

    return isDiscountApplied ? totalPrice * 0.9 : totalPrice;
  };

  const totalPrice = calculateTotalPrice();
  const totalDays = range.from && range.to ? differenceInDays(range.to, range.from) + 1 : 0;

  const handleReservationSuccess = () => {
    setShowForm(false);
    setRange({ from: undefined, to: undefined });
    setGuests(1);
    refreshBlockedDates();
    setBlockedDates(getBlockedDates());
    setIsDiscountApplied(false);
    
    toast({
      title: "Rezervasyon Talebiniz Alındı",
      description: "En kısa sürede size dönüş yapılacaktır.",
      duration: 15000,
    });
  };

  const handleRangeSelect = (newRange: { start?: Date; end?: Date }) => {
    setRange({ from: newRange.start, to: newRange.end });
  };

  const handleApplyDiscount = () => {
    if (range.from && range.to) {
      setIsDiscountApplied(true);
      setShowDiscountTimer(false);
      toast({
        title: "İndirim Uygulandı!",
        description: "Rezervasyonunuza %10 indirim uygulandı.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Tarih Seçimi Gerekli",
        description: "İndirim uygulamak için lütfen önce tarih seçimi yapın.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDiscountExpire = () => {
    setShowDiscountTimer(false);
    setIsDiscountApplied(false);
    toast({
      title: "İndirim Süresi Doldu",
      description: "Maalesef indirim süresi doldu.",
      duration: 5000,
    });
  };

  useEffect(() => {
    if (showDiscountNotification) {
      toast({
        title: "Özel İndirim Fırsatı!",
        description: "Rezervasyonunuza %10 indirim uygulayabilirsiniz. Detaylar için tıklayın!",
        duration: 10000,
        action: <Button onClick={() => {
          setShowDiscountTimer(true);
          setShowDiscountNotification(false);
        }}>İndirimi Göster</Button>,
      });
    }
  }, [showDiscountNotification, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {showDiscountTimer && (
        <DiscountTimer
          onApplyDiscount={handleApplyDiscount}
          onDiscountExpire={handleDiscountExpire}
        />
      )}

      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=2940"
            alt="VoynHouse"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div className="relative z-20 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-down">VoynHouse</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 animate-fade-in-up">
            Doğanın kalbinde, üçgen bungalov konseptiyle unutulmaz bir konaklama deneyimi
          </p>
          <a href="#reservation" className="bg-emerald-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-emerald-600 transition duration-300 animate-pulse">
            Hemen Rezervasyon Yap
          </a>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={40} color="white" />
        </div>
      </header>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Öne Çıkan Özelliklerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <HomeIcon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Modern Tasarım</h3>
                <p>Üçgen bungalov konseptiyle doğayla iç içe modern bir konaklama deneyimi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aile Dostu</h3>
                <p>6 kişiye kadar konaklama imkanı ile aileniz ve arkadaşlarınızla unutulmaz anlar</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Eşsiz Konum</h3>
                <p>Doğanın kalbinde, şehrin stresinden uzak huzurlu bir ortam</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <Card id="reservation" className="transform hover:scale-105 transition duration-300">
            <CardContent className="p-8">
              <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2 text-emerald-700">
                <Calendar className="w-8 h-8" />
                Rezervasyon
              </h2>

              <div className="space-y-6">
                {!showForm ? (
                  <>
                    <div className="bg-white rounded-lg shadow-md">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tarih Seçimi
                      </label>
                      <ReservationCalendar
                        selectedRange={{ start: range.from, end: range.to }}
                        onRangeChange={handleRangeSelect}
                        disabledDates={blockedDates}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Misafir Sayısı
                      </label>
                      <div className="flex items-center gap-4">
                        <Button
                          onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                          variant="outline"
                          size="icon"
                        >
                          -
                        </Button>
                        <span className="text-lg font-medium">{guests}</span>
                        <Button
                          onClick={() => setGuests((prev) => Math.min(6, prev + 1))}
                          variant="outline"
                          size="icon"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {range.from && range.to && (
                      <div className="bg-emerald-50 rounded-lg p-6 space-y-3 animate-fade-in">
                        <p className="text-lg">
                          <span className="font-medium">Konaklama Süresi:</span> {totalDays} gün
                        </p>
                        <p className="text-lg">
                          <span className="font-medium">Toplam Fiyat:</span>{' '}
                          {totalPrice.toLocaleString('tr-TR')} ₺
                        </p>
                        {isDiscountApplied && (
                          <p className="text-lg text-emerald-600">
                            <span className="font-medium">İndirim:</span>{' '}
                            %10 indirim uygulandı
                          </p>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={() => setShowForm(true)}
                      disabled={!range.from || !range.to}
                      className="w-full"
                    >
                      Rezervasyon Yap
                    </Button>
                  </>
                ) : (
                  <ReservationForm
                    startDate={range.from!}
                    endDate={range.to!}
                    guestCount={guests}
                    onSuccess={handleReservationSuccess}
                    totalPrice={totalPrice}
                    isDiscounted={isDiscountApplied}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="transform hover:scale-105 transition duration-300">
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2 text-emerald-700">
                  <HomeIcon className="w-8 h-8" />
                  Tesis Bilgileri
                </h2>
                <div className="space-y-4">
                  <p className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>Maksimum 6 kişi</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>Doğa ile iç içe konum</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <span>+90 555 123 4567</span>
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <span>info@voynhouse.com</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="transform hover:scale-105 transition duration-300">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-emerald-700">Özellikler</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Modern üçgen bungalov tasarımı</li>
                  <li>Tam donanımlı mutfak</li>
<li>Doğa manzaralı teras</li>
                  <li>Klima</li>
                  <li>Ücretsiz Wi-Fi</li>
                  <li>24 saat sıcak su</li>
                  <li>Güvenli park alanı</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Misafirlerimizin Yorumları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image src="/placeholder.svg?height=50&width=50" alt="Misafir" width={50} height={50} className="rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold">Ayşe Y.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"Harika bir deneyimdi! Doğayla iç içe, huzurlu bir tatil geçirdik. Kesinlikle tekrar geleceğiz."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image src="/placeholder.svg?height=50&width=50" alt="Misafir" width={50} height={50} className="rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold">Mehmet K.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"Üçgen bungalov konsepti çok ilginç ve rahat. Ailemle birlikte unutulmaz anlar yaşadık."</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image src="/placeholder.svg?height=50&width=50" alt="Misafir" width={50} height={50} className="rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold">Zeynep S.</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"Temizlik ve hizmet kalitesi mükemmeldi. Doğanın içinde lüks bir konaklama deneyimi yaşadık."</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-emerald-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">VoynHouse</h3>
              <p className="text-emerald-200">Doğanın kalbinde unutulmaz bir konaklama deneyimi</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-xl font-semibold mb-4">İletişim</h4>
              <p className="text-emerald-200">Telefon: +90 555 123 4567</p>
              <p className="text-emerald-200">E-posta: info@voynhouse.com</p>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-xl font-semibold mb-4">Bizi Takip Edin</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-emerald-200 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-emerald-200 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-emerald-200 transition duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-emerald-200">
            <p>&copy; 2023 VoynHouse. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}


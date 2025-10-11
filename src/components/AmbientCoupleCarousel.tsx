import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import coupleIndianRomantic from '@/assets/couple-indian-romantic.jpg';
import coupleBlackRomantic from '@/assets/couple-black-romantic.jpg';
import coupleWhiteNatural from '@/assets/couple-white-natural.jpg';
import coupleYoungSunsetBeach from '@/assets/couple-young-sunset-beach.jpg';


interface CoupleImage {
  src: string;
  caption: string;
  alt: string;
  srcDesktop?: string;
  srcMobile?: string;
  focusMobile?: string;
  focusTablet?: string;
  focusDesktop?: string;
}

const ambientCoupleImages: CoupleImage[] = [
  {
    src: coupleYoungSunsetBeach,
    caption: "Golden hour smiles, effortless chemistry",
    alt: "Young interracial couple laughing together at sunset on a beach",
    focusMobile: 'center 40%',
    focusTablet: 'center 35%',
    focusDesktop: 'center center'
  },
  {
    src: coupleBlackRomantic,
    caption: "Pure connection, beautiful souls",
    alt: "Beautiful Black couple sharing a romantic moment",
    focusMobile: 'center 30%',
    focusTablet: 'center 25%',
    focusDesktop: 'center 20%'
  },
  {
    src: coupleWhiteNatural,
    caption: "Natural love, timeless moments",
    alt: "Beautiful white couple in natural romantic moment",
    focusMobile: 'center 35%',
    focusTablet: 'center 30%',
    focusDesktop: 'center 25%'
  },
  {
    src: coupleIndianRomantic,
    caption: "Love transcends all boundaries",
    alt: "Beautiful Indian couple sharing a romantic moment",
    focusMobile: 'center 30%',
    focusTablet: 'center 25%',
    focusDesktop: 'center 20%'
  }
];

export const AmbientCoupleCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [deviceSize, setDeviceSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateDeviceSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceSize('mobile');
      } else if (width < 1024) {
        setDeviceSize('tablet');
      } else {
        setDeviceSize('desktop');
      }
    };
    updateDeviceSize();
    window.addEventListener('resize', updateDeviceSize);
    return () => window.removeEventListener('resize', updateDeviceSize);
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Ensure carousel is properly initialized
    const timer = setTimeout(() => {
      api.reInit();
    }, 100);

    return () => clearTimeout(timer);
  }, [api]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-light text-foreground mb-4">
          Love in all its forms
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every connection tells a story. Every story deserves to be celebrated.
        </p>
      </div>
      
      <div className="relative">
        <Carousel 
          setApi={setApi} 
          className="w-full" 
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {ambientCoupleImages.map((image, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="border-0 bg-transparent group cursor-pointer">
                   <div className="relative overflow-hidden rounded-2xl bg-muted/20">
                     <img
                       src={image.src}
                       alt={image.alt}
                       className="w-full h-72 sm:h-80 md:h-[22rem] lg:h-[26rem] xl:h-[30rem] object-cover transition-transform duration-500 group-hover:scale-105"
                       loading="lazy"
                       style={{ 
                         objectPosition: deviceSize === 'mobile' 
                           ? (image.focusMobile ?? 'center center')
                           : deviceSize === 'tablet'
                           ? (image.focusTablet ?? 'center center')
                           : (image.focusDesktop ?? 'center center')
                       }}
                     />
                   </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Desktop Navigation Arrows */}
          <CarouselPrevious className="hidden md:flex -left-6 lg:-left-12 xl:-left-16 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background text-foreground hover:text-foreground" />
          <CarouselNext className="hidden md:flex -right-6 lg:-right-12 xl:-right-16 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background text-foreground hover:text-foreground" />
        </Carousel>
      </div>
      
      {/* Mobile Navigation Dots */}
      <div className="flex justify-center mt-6 md:hidden">
        {ambientCoupleImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
              index === current 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Tablet Navigation Dots */}
      <div className="hidden md:flex lg:hidden justify-center mt-6">
        {ambientCoupleImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-1.5 transition-all duration-300 ${
              index === current 
                ? 'bg-primary' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
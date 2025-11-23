import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, Award, Heart, ChefHat } from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';
import MenuCard from '@/components/MenuCard';
import { useState, useEffect } from 'react';

const Home = () => {
  const { menuItems, homeContent, heroTexts, heroImages } = useRestaurant();
  const featuredItems = menuItems.filter((item) => item.featured).slice(0, 3);
  const heroTitle = heroTexts?.home?.title || homeContent?.hero?.title;
  const heroSubtitle = heroTexts?.home?.subtitle || homeContent?.hero?.subtitle;
  const heroTagline = heroTexts?.home?.tagline || homeContent?.hero?.tagline;

  // Hero slider state using images from context
  const heroImagesArray = (heroImages?.home || []).filter(url => url && url.trim() !== '');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slider
  useEffect(() => {
    if (heroImagesArray.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImagesArray.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImagesArray.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Slider */}
        <div className="absolute inset-0">
          {heroImagesArray.length > 0 ? (
            heroImagesArray.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="absolute inset-0 scale-105 blur-[0.5px]">
                  <img src={image} alt={`Hero ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
              </div>
            ))
          ) : (
            // Fallback if no images
            <div className="absolute inset-0 bg-black/80" />
          )}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-center mb-4">
                <ChefHat className="h-16 w-16 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white">
                {heroTitle || 'Osei Serwaa Kitchen'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {heroSubtitle || 'Authentic West African Cuisine'}
              </p>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {heroTagline || 'Experience the rich flavors and traditions of Ghana in every dish'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up">
              <Link to="/menu">
                <Button size="lg" className="text-lg px-10 bg-primary hover:bg-primary-hover text-white">
                  View Menu
                </Button>
              </Link>
              <Link to="/reservations">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 text-white border-2 border-white rounded-full hover:bg-white/10 hover:border-white backdrop-blur-sm bg-white/5"
                >
                  Make a Reservation
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-7 h-11 border-2 border-white/30 rounded-full flex items-start justify-center p-2 bg-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(homeContent?.features || []).map((feature, index) => {
              const icons = [Award, Star, Clock, Heart];
              const Icon = icons[index % icons.length];
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-card transition-all duration-500 hover-scale group border-border/50 hover:border-primary/20"
                >
                  <CardContent className="pt-10 pb-8 space-y-5">
                    <div className="flex justify-center">
                      <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                        <Icon className="h-9 w-9 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-5 mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Featured <span className="gradient-text">Dishes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our most popular traditional Ghanaian dishes, loved by our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredItems.map((item) => (
              <div key={item.id} className="animate-fade-in">
                <MenuCard item={item} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/menu">
              <Button size="lg" variant="outline" className="hover-scale hover:border-primary text-base px-10">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 bg-gradient-warm text-primary-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center space-y-10 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {homeContent?.cta?.title || 'Ready to Experience True Ghanaian Flavors?'}
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-95 leading-relaxed">
            {homeContent?.cta?.description || 'Book a table and come experience the best of authentic Ghanaian cuisine.'}
          </p>
          <div className="flex justify-center pt-6">
            <Link to="/reservations">
              <Button size="lg" variant="secondary" className="text-lg px-12 hover-scale shadow-lg">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Award, Utensils, ChefHat } from 'lucide-react';
import heroRestaurant from '@/assets/hero-restaurant.jpg';
import { useRestaurant } from '@/context/RestaurantContext';
import { useState, useEffect } from 'react';

const About = () => {
  const { heroImages, aboutContent, heroTexts } = useRestaurant();
  const rawImages = heroImages?.about || [];
  const validImages = rawImages.filter(url => url && url.trim() !== '');
  const heroImagesArray = validImages.length > 0 ? validImages : [heroRestaurant];

  const heroTitle = heroTexts?.about?.title || 'About Us';
  const heroSubtitle = heroTexts?.about?.subtitle || aboutContent?.story?.paragraph1;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroImagesArray.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImagesArray.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImagesArray.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImagesArray.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 scale-105 blur-[0.5px]">
                <img src={image} alt={`About hero ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-center mb-4">
                <ChefHat className="h-16 w-16 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white">
                {heroTitle || 'About Us'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24 bg-gradient-subtle">

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {aboutContent?.story?.paragraph1}
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {aboutContent?.story?.paragraph2}
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {aboutContent?.story?.paragraph3}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <img
              src={aboutContent?.story?.images?.[0] || "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80"}
              alt="Authentic Jollof Rice"
              className="aspect-square object-cover rounded-2xl shadow-card hover:scale-105 transition-transform duration-500"
            />
            <img
              src={aboutContent?.story?.images?.[1] || "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"}
              alt="Traditional Savory Dish"
              className="aspect-square object-cover rounded-2xl shadow-card hover:scale-105 transition-transform duration-500 mt-8"
            />
            <img
              src={aboutContent?.story?.images?.[2] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"}
              alt="Grilled Specialties"
              className="aspect-square object-cover rounded-2xl shadow-card hover:scale-105 transition-transform duration-500 -mt-8"
            />
            <img
              src={aboutContent?.story?.images?.[3] || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80"}
              alt="Ghanaian Feast"
              className="aspect-square object-cover rounded-2xl shadow-card hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {(aboutContent?.values || []).map((value, index) => {
              const icons = [Heart, Award, Users, Utensils];
              const Icon = icons[index % icons.length];
              return (
                <Card key={index} className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] min-w-[280px] hover:shadow-card transition-all duration-500 hover-scale group border-border/50 hover:border-primary/20">
                  <CardContent className="pt-10 pb-8 text-center space-y-5">
                    <div className="flex justify-center">
                      <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                        <Icon className="h-9 w-9 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {(aboutContent?.team || []).map((member, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-500 hover-scale border-border/50 hover:border-primary/20">
                <CardContent className="pt-8 text-center space-y-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-28 h-28 mx-auto rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full shadow-md" />
                  )}
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-semibold text-lg">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

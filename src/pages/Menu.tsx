import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import MenuCard from '@/components/MenuCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChefHat } from 'lucide-react';
import heroImage from '@/assets/hero-restaurant.jpg';

const Menu = () => {
  const { menuItems, categories } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <ChefHat className="h-16 w-16 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Our <span className="gradient-text">Menu</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Explore our selection of authentic Ghanaian dishes, prepared fresh daily with traditional recipes
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 bg-gradient-subtle">

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for your favorite dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base shadow-sm border-border/50 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <Button
            variant={selectedCategory === 'all' ? 'premium' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="hover-scale"
            size="lg"
          >
            All Dishes
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="hover-scale"
              size="lg"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredItems.map((item) => (
              <div key={item.id} className="animate-fade-in">
                <MenuCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-6 opacity-20">🔍</div>
            <p className="text-2xl font-semibold mb-2">No dishes found</p>
            <p className="text-lg text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;

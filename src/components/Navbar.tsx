import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'glass py-2'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src={isDark || !isScrolled ? '/logo%20main.png' : '/logo%20black.png'}
              alt="Osei Serwaa Kitchen"
              className="h-10 md:h-12 hover-lift"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative hover-lift ${isActive(link.path)
                  ? isScrolled ? 'text-primary font-bold' : 'text-white font-bold'
                  : isScrolled ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 ${isScrolled ? 'bg-primary' : 'bg-white'} rounded-full animate-scale-in`} />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`rounded-full transition-all duration-300 ${isScrolled
                ? 'hover:bg-primary/10 hover:text-primary'
                : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 rounded-full transition-all duration-300 ${isScrolled
                ? 'hover:bg-primary/10 hover:text-primary'
                : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-heading">+233 24 750 5196</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors rounded-full hover:bg-white/10 ${isScrolled ? 'text-foreground' : 'text-white'}`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass border-t border-white/20 animate-fade-in-up">
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors px-4 py-3 rounded-lg ${isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/50 px-4 flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="gap-2 justify-start px-0 hover:bg-transparent"
                >
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white">
                  <Phone className="h-4 w-4" />
                  <span>+233 24 750 5196</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

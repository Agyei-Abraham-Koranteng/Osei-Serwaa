import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useRestaurant } from '@/context/RestaurantContext';

const Footer = () => {
  const { footerContent, contactPageInfo } = useRestaurant();

  return (
    <footer className="bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-fg))] border-t border-border/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold gradient-text">Osei Serwaa Kitchen</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              {footerContent?.description || 'Authentic Ghanaian cuisine prepared with love and traditional recipes passed down through generations.'}
            </p>
            <div className="flex space-x-3">
              {footerContent?.socialLinks?.facebook && (
                <a
                  href={footerContent.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background/10 rounded-full hover:bg-gradient-warm hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footerContent?.socialLinks?.instagram && (
                <a
                  href={footerContent.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background/10 rounded-full hover:bg-gradient-warm hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {footerContent?.socialLinks?.twitter && (
                <a
                  href={footerContent.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background/10 rounded-full hover:bg-gradient-warm hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-primary-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Menu', path: '/menu' },
                { name: 'About Us', path: '/about' },
                { name: 'Reservations', path: '/reservations' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm opacity-90 hover:opacity-100 hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Opening Hours</h3>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p>{contactPageInfo?.contactInfo?.hours?.weekday || '11:00 AM - 10:00 PM'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Saturday - Sunday</p>
                  <p>{contactPageInfo?.contactInfo?.hours?.weekend || '10:00 AM - 11:00 PM'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Contact Us</h3>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="whitespace-pre-line">{contactPageInfo?.contactInfo?.address || '123 Liberation Road, Accra, Ghana'}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{contactPageInfo?.contactInfo?.phone || '+233 24 750 5196'}</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{contactPageInfo?.contactInfo?.email || 'hello@oseiserwaa.com'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm opacity-80">
          <p className="font-medium">{footerContent?.copyrightText || `© ${new Date().getFullYear()} Osei Serwaa Kitchen. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

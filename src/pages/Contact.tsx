import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRestaurant } from '@/context/RestaurantContext';
import heroRestaurant from '@/assets/hero-restaurant.jpg';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const { addContactMessage } = useRestaurant();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactMessage(formData);
    toast({
      title: 'Message sent!',
      description: 'Thank you for contacting us. We will get back to you soon.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroRestaurant})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 bg-gradient-subtle">

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="hover:shadow-card transition-all duration-500 border-border/50 hover:border-primary/20">
              <CardContent className="p-7 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-sm">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Address</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      123 Liberation Road<br />
                      Accra, Ghana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-all duration-500 border-border/50 hover:border-primary/20">
              <CardContent className="p-7 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-sm">
                    <Phone className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Phone</h3>
                    <p className="text-sm text-muted-foreground">+233 24 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-all duration-500 border-border/50 hover:border-primary/20">
              <CardContent className="p-7 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-sm">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Email</h3>
                    <p className="text-sm text-muted-foreground">hello@oseiserwaa.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-card transition-all duration-500 border-border/50 hover:border-primary/20">
              <CardContent className="p-7 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl shadow-sm">
                    <Clock className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-lg">Opening Hours</h3>
                    <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
                      <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
                      <p>Sat - Sun: 10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card border-border/50">
              <CardContent className="p-10">
                <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Name *</Label>
                      <Input
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject *</Label>
                    <Input
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message *</Label>
                    <Textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full hover-scale text-lg shadow-sm" variant="premium">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <Card className="shadow-card border-border/50">
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-br from-primary/5 via-accent/5 to-muted rounded-xl flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="text-6xl opacity-20">📍</div>
                  <p className="text-lg text-muted-foreground font-medium">123 Liberation Road, Accra, Ghana</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;

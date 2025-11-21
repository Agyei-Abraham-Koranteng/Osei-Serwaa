import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-restaurant.jpg';

const ContactInfoManagement = () => {
  const { toast } = useToast();
  
  const [contactInfo, setContactInfo] = useState({
    address: '123 Liberation Road\nAccra, Ghana',
    phone: '+233 24 123 4567',
    email: 'hello@oseiserwaa.com',
    hours: {
      weekday: 'Mon - Fri: 11:00 AM - 10:00 PM',
      weekend: 'Sat - Sun: 10:00 AM - 11:00 PM',
    },
  });

  const [pageContent, setPageContent] = useState({
    heroTitle: 'Contact Us',
    heroSubtitle: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
  });

  const handleSave = () => {
    toast({
      title: 'Changes saved!',
      description: 'Contact information has been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Contact Info Management</h1>
            <p className="text-white/90">Manage contact information displayed on the contact page</p>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={pageContent.heroTitle}
              onChange={(e) => setPageContent({ ...pageContent, heroTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              value={pageContent.heroSubtitle}
              onChange={(e) => setPageContent({ ...pageContent, heroSubtitle: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              rows={3}
              placeholder="Enter full address"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="+233 24 123 4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="hello@restaurant.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Opening Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hours-weekday">Weekday Hours</Label>
            <Input
              id="hours-weekday"
              value={contactInfo.hours.weekday}
              onChange={(e) =>
                setContactInfo({
                  ...contactInfo,
                  hours: { ...contactInfo.hours, weekday: e.target.value },
                })
              }
              placeholder="Mon - Fri: 11:00 AM - 10:00 PM"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours-weekend">Weekend Hours</Label>
            <Input
              id="hours-weekend"
              value={contactInfo.hours.weekend}
              onChange={(e) =>
                setContactInfo({
                  ...contactInfo,
                  hours: { ...contactInfo.hours, weekend: e.target.value },
                })
              }
              placeholder="Sat - Sun: 10:00 AM - 11:00 PM"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default ContactInfoManagement;

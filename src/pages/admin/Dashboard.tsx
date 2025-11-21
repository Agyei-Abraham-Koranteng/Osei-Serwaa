import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRestaurant } from '@/context/RestaurantContext';
import { Calendar, UtensilsCrossed, MessageSquare, Users, Home, Image, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { reservations, menuItems, contactMessages } = useRestaurant();

  const stats = [
    {
      title: 'Reservations',
      value: reservations.length,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Menu Items',
      value: menuItems.length,
      icon: UtensilsCrossed,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Contact Messages',
      value: contactMessages.filter(m => m.status === 'unread').length,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Confirmed Bookings',
      value: reservations.filter(r => r.status === 'confirmed').length,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const quickLinks = [
    { path: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed, color: 'text-purple-600' },
    { path: '/admin/reservations', label: 'Reservations', icon: Calendar, color: 'text-green-600' },
    { path: '/admin/contact-messages', label: 'Messages', icon: MessageSquare, color: 'text-blue-600' },
    { path: '/admin/home', label: 'Home Content', icon: Home, color: 'text-orange-600' },
    { path: '/admin/gallery', label: 'Gallery', icon: Image, color: 'text-pink-600' },
    { path: '/admin/contact', label: 'Contact Info', icon: Phone, color: 'text-teal-600' },
  ];

  const upcomingReservations = reservations
    .filter((r) => r.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentMessages = contactMessages
    .filter(m => m.status === 'unread')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to your restaurant admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button 
                    variant="outline" 
                    className="w-full h-auto flex flex-col items-center gap-3 py-6 hover:border-primary/50 hover:shadow-sm transition-all"
                  >
                    <Icon className={`h-8 w-8 ${link.color}`} />
                    <span className="text-sm font-medium text-center">{link.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{message.name}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{message.subject}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{message.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No new messages</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{reservation.name}</p>
                      <p className="text-sm text-muted-foreground">{reservation.date} at {reservation.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{reservation.guests} guests</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          reservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No upcoming reservations</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

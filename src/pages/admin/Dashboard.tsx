import { useRestaurant } from '@/context/RestaurantContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, Utensils, Users, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { reservations, contactMessages, menuItems, siteVisitors } = useRestaurant();

    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;
    const totalMenuItems = menuItems.length;

    const recentReservations = [...reservations]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    const recentMessages = [...contactMessages]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground text-lg">Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-border/50 shadow-md hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reservations</CardTitle>
                        <Calendar className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingReservations}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {reservations.length} total bookings
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-md hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
                        <Mail className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadMessages}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {contactMessages.length} total messages
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-md hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Menu Items</CardTitle>
                        <Utensils className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMenuItems}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active dishes
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-md hover:shadow-lg transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Site Visitors</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{siteVisitors}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total visits
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Reservations */}
                <Card className="border-border/50 shadow-lg">
                    <CardHeader className="border-b border-border/50 bg-muted/30">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" /> Recent Reservations
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                                <Link to="/admin/reservations">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {recentReservations.length > 0 ? (
                            <div className="space-y-4">
                                {recentReservations.map((res) => (
                                    <div key={res.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
                                        <div>
                                            <p className="font-medium">{res.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(res.date).toLocaleDateString()} at {res.time} • {res.guests} guests
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${res.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            res.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No recent reservations</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card className="border-border/50 shadow-lg">
                    <CardHeader className="border-b border-border/50 bg-muted/30">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Mail className="h-5 w-5 text-accent" /> Recent Messages
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-accent hover:text-accent/80">
                                <Link to="/admin/contact">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {recentMessages.length > 0 ? (
                            <div className="space-y-4">
                                {recentMessages.map((msg) => (
                                    <div key={msg.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
                                        <div className="overflow-hidden">
                                            <p className="font-medium truncate">{msg.subject}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                From: {msg.name} • {new Date(msg.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${msg.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {msg.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">No recent messages</p>
                        )}
                    </CardContent>
                </Card>
            </div>



        </div >
    );
};

export default Dashboard;

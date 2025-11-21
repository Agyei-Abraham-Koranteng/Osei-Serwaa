import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation } = useRestaurant();
  const { toast } = useToast();

  const handlePrint = (reservation: Reservation) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reservation - ${reservation.name}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #e74c3c;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #e74c3c;
              margin: 0;
              font-size: 32px;
            }
            .header p {
              color: #666;
              margin: 5px 0 0 0;
            }
            .section {
              margin: 30px 0;
              padding: 20px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            .section h2 {
              color: #333;
              margin-top: 0;
              font-size: 20px;
              border-bottom: 2px solid #e74c3c;
              padding-bottom: 10px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 15px 0;
              padding: 10px;
              background: white;
              border-radius: 4px;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
            }
            .detail-value {
              color: #333;
            }
            .status {
              display: inline-block;
              padding: 8px 16px;
              border-radius: 20px;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
            }
            .status-confirmed { background: #d4edda; color: #155724; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-cancelled { background: #f8d7da; color: #721c24; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 14px;
              border-top: 2px solid #e0e0e0;
              padding-top: 20px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍴 Osei Serwaa Kitchen</h1>
            <p>Authentic West African Cuisine</p>
          </div>

          <div class="section">
            <h2>Reservation Details</h2>
            <div class="detail-row">
              <span class="detail-label">Reservation ID:</span>
              <span class="detail-value">${reservation.id}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="status status-${reservation.status}">${reservation.status}</span>
            </div>
          </div>

          <div class="section">
            <h2>Guest Information</h2>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${reservation.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${reservation.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${reservation.phone}</span>
            </div>
          </div>

          <div class="section">
            <h2>Booking Information</h2>
            <div class="detail-row">
              <span class="detail-label">📅 Date:</span>
              <span class="detail-value">${reservation.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Time:</span>
              <span class="detail-value">${reservation.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👥 Number of Guests:</span>
              <span class="detail-value">${reservation.guests}</span>
            </div>
          </div>

          ${reservation.specialRequests ? `
          <div class="section">
            <h2>Special Requests</h2>
            <div class="detail-row">
              <span class="detail-value">${reservation.specialRequests}</span>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <p>123 Liberation Road, Accra, Ghana</p>
            <p>Phone: +233 24 123 4567 | Email: hello@oseiserwaa.com</p>
            <p style="margin-top: 20px; font-style: italic;">Thank you for choosing Osei Serwaa Kitchen!</p>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 12px 30px; background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
              Print Reservation
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({
      title: 'Status updated',
      description: 'Reservation status has been updated successfully.',
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({
        title: 'Reservation deleted',
        description: 'The reservation has been removed.',
      });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6">
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
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage table reservations</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedReservations.length > 0 ? (
          sortedReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{reservation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reservation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(reservation.createdAt).toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePrint(reservation)}
                      className="gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>

                    <Select
                      value={reservation.status}
                      onValueChange={(value: Reservation['status']) =>
                        handleStatusChange(reservation.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(reservation.id, reservation.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;

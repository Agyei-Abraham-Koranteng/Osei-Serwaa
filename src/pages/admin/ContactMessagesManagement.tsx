import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Calendar } from 'lucide-react';
import { ContactMessage } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ContactMessagesManagement = () => {
  const { contactMessages, updateContactMessageStatus, deleteContactMessage } = useRestaurant();
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: ContactMessage['status']) => {
    updateContactMessageStatus(id, newStatus);
    toast({
      title: 'Status updated',
      description: 'Message status has been updated successfully.',
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the message from ${name}?`)) {
      deleteContactMessage(id);
      toast({
        title: 'Message deleted',
        description: 'The message has been removed.',
      });
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'read':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'unread':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedMessages = [...contactMessages].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
            <h1 className="text-4xl font-bold text-white mb-2">Contact Messages</h1>
            <p className="text-white/90">View and manage customer inquiries</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedMessages.length > 0 ? (
          sortedMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      {message.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{message.email}</p>
                  </div>
                  <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Subject</p>
                  <p className="text-sm font-medium">{message.subject}</p>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Message</p>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(message.createdAt).toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={message.status}
                      onValueChange={(value: ContactMessage['status']) =>
                        handleStatusChange(message.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(message.id, message.name)}
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
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No messages yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesManagement;

import { useState, useEffect } from 'react';
import { useRestaurant, ContactMessage } from '@/context/RestaurantContext';
import { exportToCSV } from '@/utils/exportCSV';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, Eye, Mail, Sparkles, MapPin, Phone, Clock, Archive, Loader2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ContactManagement = () => {
    const { contactPageInfo, setContactPageInfo, heroTexts, setHeroText, heroImages, setHeroImage, contactMessages, updateContactMessageStatus, deleteContactMessage } = useRestaurant();
    const { toast } = useToast();

    // Hero Section
    const [heroTitle, setHeroTitle] = useState(heroTexts?.contact?.title || contactPageInfo?.pageContent?.heroTitle || 'Contact Us');
    const [heroSubtitle, setHeroSubtitle] = useState(heroTexts?.contact?.subtitle || contactPageInfo?.pageContent?.heroSubtitle || '');
    const [heroTagline, setHeroTagline] = useState(heroTexts?.contact?.tagline || '');
    const [heroImagesArray, setHeroImagesArray] = useState<string[]>(heroImages?.contact || []);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);

    // Contact Info
    const [contactInfo, setContactInfo] = useState(contactPageInfo?.contactInfo || {
        address: '',
        phone: '',
        email: '',
        hours: { weekday: '', weekend: '' },
        mapUrl: ''
    });

    // Message Dialog
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);

    useEffect(() => {
        if (heroTexts?.contact) {
            setHeroTitle(heroTexts.contact.title || 'Contact Us');
            setHeroSubtitle(heroTexts.contact.subtitle || '');
            setHeroTagline(heroTexts.contact.tagline || '');
        }
    }, [heroTexts]);

    useEffect(() => {
        if (heroImages?.contact) {
            setHeroImagesArray(heroImages.contact);
        }
    }, [heroImages]);

    useEffect(() => {
        if (contactPageInfo?.contactInfo) {
            setContactInfo(contactPageInfo.contactInfo);
        }
    }, [contactPageInfo]);

    const handleSaveHero = async () => {
        setIsSaving(true);
        try {
            const cleanImages = heroImagesArray.filter(url => url && url.trim() !== '');
            setHeroImagesArray(cleanImages);

            await Promise.all([
                setHeroText('contact', { title: heroTitle, subtitle: heroSubtitle, tagline: heroTagline }),
                setHeroImage('contact', cleanImages)
            ]);
            toast({ title: '✨ Success', description: 'Hero section updated successfully' });
        } catch (error) {
            console.error('Failed to save hero section:', error);
            toast({ title: 'Error', description: 'Failed to save changes', variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddHeroImage = () => {
        setHeroImagesArray([...heroImagesArray, '']);
    };

    const handleHeroImageChange = (index: number, url: string) => {
        const newArr = [...heroImagesArray];
        newArr[index] = url;
        setHeroImagesArray(newArr);
    };

    const handleSaveContactInfo = () => {
        setContactPageInfo({
            ...contactPageInfo,
            contactInfo,
        });
        toast({ title: '✨ Success', description: 'Contact information updated successfully' });
    };

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        setMessageDialogOpen(true);
        if (message.status === 'unread') {
            updateContactMessageStatus(message.id, 'read');
        }
    };

    const handleDeleteMessage = (id: string) => {
        setDeleteMessageId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteMessageId) {
            await deleteContactMessage(deleteMessageId);
            toast({ title: '✨ Success', description: 'Message deleted successfully' });
        }
        setDeleteDialogOpen(false);
        setDeleteMessageId(null);
    };

    const handleExportMessages = () => {
        if (contactMessages.length === 0) {
            toast({
                title: 'No Data',
                description: 'There are no messages to export.',
                variant: 'destructive'
            });
            return;
        }

        const exportData = contactMessages.map(m => ({
            'ID': m.id,
            'Name': m.name,
            'Email': m.email,
            'Subject': m.subject,
            'Message': m.message,
            'Status': m.status,
            'Created At': new Date(m.createdAt).toLocaleString()
        }));

        exportToCSV(exportData, 'contact_messages');
        toast({
            title: '✅ Exported',
            description: `${contactMessages.length} messages exported successfully`
        });
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Contact Page Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage contact information and messages</p>
                </div>
            </div>

            <Tabs defaultValue="messages" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="messages" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-secondary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Mail className="h-4 w-4 mr-2" />
                        Messages
                    </TabsTrigger>
                    <TabsTrigger value="hero" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Hero Section
                    </TabsTrigger>
                    <TabsTrigger value="info" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <MapPin className="h-4 w-4 mr-2" />
                        Contact Info
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Hero Content</CardTitle>
                            <CardDescription className="text-base">Edit the hero section of the contact page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="hero-title" className="text-base font-semibold">Title</Label>
                                <Input
                                    id="hero-title"
                                    value={heroTitle}
                                    onChange={(e) => setHeroTitle(e.target.value)}
                                    placeholder="Contact Us"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="hero-subtitle" className="text-base font-semibold">Subtitle</Label>
                                <Textarea
                                    id="hero-subtitle"
                                    value={heroSubtitle}
                                    onChange={(e) => setHeroSubtitle(e.target.value)}
                                    placeholder="Have questions? We'd love to hear from you."
                                    rows={2}
                                    className="text-base border-border/50 focus:border-primary/50 resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="hero-tagline" className="text-base font-semibold">Tagline</Label>
                                <Input
                                    id="hero-tagline"
                                    value={heroTagline}
                                    onChange={(e) => setHeroTagline(e.target.value)}
                                    placeholder="Tagline"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            {heroImagesArray.map((url, idx) => (
                                <ImageUpload
                                    key={idx}
                                    label={`Hero Image ${idx + 1}`}
                                    value={url}
                                    onChange={newUrl => handleHeroImageChange(idx, newUrl)}
                                />
                            ))}
                            <Button onClick={handleAddHeroImage} variant="outline" className="w-full h-12 text-base font-semibold mt-2">
                                Add Image
                            </Button>

                            <Button
                                onClick={handleSaveHero}
                                disabled={isSaving}
                                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                                variant="premium"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Hero Section
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="info" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Contact Details</CardTitle>
                            <CardDescription className="text-base">Edit the contact information displayed on the page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" /> Address
                                </Label>
                                <Textarea
                                    id="address"
                                    value={contactInfo.address}
                                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                    placeholder="123 Liberation Road&#10;Accra, Ghana"
                                    rows={3}
                                    className="text-base border-border/50 focus:border-primary/50 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" /> Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                        placeholder="+233 24 750 5196"
                                        className="h-12 text-base border-border/50 focus:border-primary/50"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" /> Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                        placeholder="hello@oseiserwaa.com"
                                        className="h-12 text-base border-border/50 focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="weekday-hours" className="text-base font-semibold flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" /> Weekday Hours
                                    </Label>
                                    <Input
                                        id="weekday-hours"
                                        value={contactInfo.hours.weekday}
                                        onChange={(e) => setContactInfo({
                                            ...contactInfo,
                                            hours: { ...contactInfo.hours, weekday: e.target.value }
                                        })}
                                        placeholder="Mon - Fri: 11:00 AM - 10:00 PM"
                                        className="h-12 text-base border-border/50 focus:border-primary/50"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="weekend-hours" className="text-base font-semibold flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" /> Weekend Hours
                                    </Label>
                                    <Input
                                        id="weekend-hours"
                                        value={contactInfo.hours.weekend}
                                        onChange={(e) => setContactInfo({
                                            ...contactInfo,
                                            hours: { ...contactInfo.hours, weekend: e.target.value }
                                        })}
                                        placeholder="Sat - Sun: 10:00 AM - 11:00 PM"
                                        className="h-12 text-base border-border/50 focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="map-url" className="text-base font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" /> Google Maps Embed URL
                                </Label>
                                <Input
                                    id="map-url"
                                    value={contactInfo.mapUrl || ''}
                                    onChange={(e) => {
                                        let val = e.target.value;

                                        // Try to extract src if user pastes full iframe code
                                        if (val.includes('<iframe') && val.includes('src="')) {
                                            const match = val.match(/src="([^"]+)"/);
                                            if (match && match[1]) {
                                                val = match[1];
                                                toast({ title: "URL Extracted", description: "Extracted the embed URL from the iframe code." });
                                            }
                                        }

                                        // Always decode HTML entities
                                        try {
                                            const txt = document.createElement('textarea');
                                            txt.innerHTML = val;
                                            val = txt.value;
                                        } catch (err) {
                                            console.error('Failed to decode URL:', err);
                                        }

                                        setContactInfo({ ...contactInfo, mapUrl: val.trim() });
                                    }}
                                    placeholder="https://www.google.com/maps/embed?..."
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Paste the full <code>&lt;iframe&gt;</code> code from Google Maps, or just the URL from the <code>src</code> attribute.
                                </p>
                                {contactInfo.mapUrl && !contactInfo.mapUrl.includes('/embed') && (
                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600 text-sm flex items-start gap-2">
                                        <span className="text-lg">⚠️</span>
                                        <p>
                                            This doesn't look like a valid embed URL. It should usually contain <code>/embed</code>.
                                            Regular Google Maps links will not work. Please use the <strong>Share {'>'} Embed a map</strong> option in Google Maps.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <Button onClick={handleSaveContactInfo} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />
                                Save Contact Information
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent >

                <TabsContent value="messages" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Messages</CardTitle>
                                    <CardDescription className="text-base">View and manage contact form submissions</CardDescription>
                                </div>
                                <Button onClick={handleExportMessages} variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {/* Status Filter Tabs */}
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid w-full grid-cols-5 mb-6">
                                    <TabsTrigger value="all" className="text-sm">
                                        All ({contactMessages.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="unread" className="text-sm">
                                        🔴 Unread ({contactMessages.filter(m => m.status === 'unread').length})
                                    </TabsTrigger>
                                    <TabsTrigger value="read" className="text-sm">
                                        🔵 Read ({contactMessages.filter(m => m.status === 'read').length})
                                    </TabsTrigger>
                                    <TabsTrigger value="replied" className="text-sm">
                                        ✅ Replied ({contactMessages.filter(m => m.status === 'replied').length})
                                    </TabsTrigger>
                                    <TabsTrigger value="archived" className="text-sm">
                                        📦 Archived ({contactMessages.filter(m => m.status === 'archived').length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="all">
                                    <MessageTable
                                        messages={contactMessages}
                                        onView={handleViewMessage}
                                        onStatusChange={updateContactMessageStatus}
                                        onDelete={handleDeleteMessage}
                                    />
                                </TabsContent>

                                <TabsContent value="unread">
                                    <MessageTable
                                        messages={contactMessages.filter(m => m.status === 'unread')}
                                        onView={handleViewMessage}
                                        onStatusChange={updateContactMessageStatus}
                                        onDelete={handleDeleteMessage}
                                    />
                                </TabsContent>

                                <TabsContent value="read">
                                    <MessageTable
                                        messages={contactMessages.filter(m => m.status === 'read')}
                                        onView={handleViewMessage}
                                        onStatusChange={updateContactMessageStatus}
                                        onDelete={handleDeleteMessage}
                                    />
                                </TabsContent>

                                <TabsContent value="replied">
                                    <MessageTable
                                        messages={contactMessages.filter(m => m.status === 'replied')}
                                        onView={handleViewMessage}
                                        onStatusChange={updateContactMessageStatus}
                                        onDelete={handleDeleteMessage}
                                    />
                                </TabsContent>

                                <TabsContent value="archived">
                                    <MessageTable
                                        messages={contactMessages.filter(m => m.status === 'archived')}
                                        onView={handleViewMessage}
                                        onStatusChange={updateContactMessageStatus}
                                        onDelete={handleDeleteMessage}
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs >

            {/* Message View Dialog */}
            < Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen} >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Message Details</DialogTitle>
                        <DialogDescription>
                            From {selectedMessage?.name} • {selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedMessage && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">Name</Label>
                                    <p className="text-base mt-1">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">Email</Label>
                                    <p className="text-base mt-1">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-muted-foreground">Subject</Label>
                                <p className="text-base mt-1">{selectedMessage.subject}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-muted-foreground">Message</Label>
                                <p className="text-base mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-semibold text-muted-foreground">Status:</Label>
                                <StatusBadge status={selectedMessage.status} />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog >
            {/* Delete Confirmation Dialog */}
            < Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this message? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </div>
                </DialogContent>
            </Dialog >
        </div >
    );
};

// Message Table Component
const MessageTable = ({ messages, onView, onStatusChange, onDelete }: {
    messages: ContactMessage[];
    onView: (message: ContactMessage) => void;
    onStatusChange: (id: string, status: ContactMessage['status']) => void;
    onDelete: (id: string) => void;
}) => {
    if (messages.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No messages found</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {messages.map((message) => (
                        <TableRow key={message.id} className={`hover:bg-muted/20 ${message.status === 'unread' ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>
                            <TableCell className="font-medium">
                                {message.status === 'unread' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>}
                                {message.name}
                            </TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell>{message.subject}</TableCell>
                            <TableCell>
                                <StatusBadge status={message.status} />
                            </TableCell>
                            <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(message)}
                                        className="h-8 px-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                    {message.status !== 'replied' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onStatusChange(message.id, 'replied')}
                                            className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            title="Mark as Replied"
                                        >
                                            ✓
                                        </Button>
                                    )}

                                    {message.status !== 'archived' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onStatusChange(message.id, 'archived')}
                                            className="h-8 px-2"
                                            title="Archive"
                                        >
                                            <Archive className="h-4 w-4" />
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(message.id)}
                                        className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: ContactMessage['status'] }) => {
    const styles = {
        unread: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        read: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        replied: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    };

    const icons = {
        unread: '🔴',
        read: '🔵',
        replied: '✅',
        archived: '📦'
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${styles[status]}`}>
            <span>{icons[status]}</span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default ContactManagement;

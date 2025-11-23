import { useState } from 'react';
import { useRestaurant, Reservation } from '@/context/RestaurantContext';
import { exportToCSV } from '@/utils/exportCSV';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Search, CheckCircle, XCircle, Clock, Users, Phone, Mail, Trash2, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ReservationsManagement = () => {
    const { reservations, updateReservationStatus, deleteReservation } = useRestaurant();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

    const filteredReservations = reservations.filter(res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(res.id).includes(searchTerm)
    );

    const pendingReservations = reservations.filter(r => r.status === 'pending');
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
    const todayReservations = reservations.filter(r => {
        const today = new Date().toISOString().split('T')[0];
        return r.date === today && r.status !== 'cancelled';
    });

    const handleStatusUpdate = (id: string, status: Reservation['status']) => {
        updateReservationStatus(id, status);
        toast({
            title: 'Status Updated',
            description: `Reservation marked as ${status}`,
        });
    };

    const handleDeleteClick = (id: string) => {
        setReservationToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (reservationToDelete) {
            deleteReservation(reservationToDelete);
            toast({
                title: 'Reservation Deleted',
                description: 'The reservation has been permanently removed.',
            });
            setReservationToDelete(null);
        }
    };

    const handleExportReservations = () => {
        if (reservations.length === 0) {
            toast({
                title: 'No Data',
                description: 'There are no reservations to export.',
                variant: 'destructive'
            });
            return;
        }

        const exportData = reservations.map(r => ({
            'ID': r.id,
            'Name': r.name,
            'Email': r.email,
            'Phone': r.phone,
            'Date': r.date,
            'Time': r.time,
            'Guests': r.guests,
            'Status': r.status,
            'Created At': new Date(r.createdAt).toLocaleString()
        }));

        exportToCSV(exportData, 'reservations');
        toast({
            title: '✅ Exported',
            description: `${reservations.length} reservations exported successfully`
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
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Reservations
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage table bookings and guest requests</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Today's Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayReservations.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pendingReservations.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Upcoming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{confirmedReservations.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="w-full space-y-6">
                <div className="flex items-center justify-between">
                    <TabsList className="h-12 p-1 bg-muted/50 rounded-xl">
                        <TabsTrigger value="all" className="h-10 rounded-lg">All Reservations</TabsTrigger>
                        <TabsTrigger value="pending" className="h-10 rounded-lg">Pending</TabsTrigger>
                        <TabsTrigger value="confirmed" className="h-10 rounded-lg">Confirmed</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 border-border/50 focus:border-primary/50"
                            />
                        </div>
                        <Button onClick={handleExportReservations} variant="outline" className="h-12">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                <TabsContent value="all" className="mt-0">
                    <ReservationsTable
                        data={filteredReservations}
                        onStatusUpdate={handleStatusUpdate}
                        onDelete={handleDeleteClick}
                    />
                </TabsContent>

                <TabsContent value="pending" className="mt-0">
                    <ReservationsTable
                        data={filteredReservations.filter(r => r.status === 'pending')}
                        onStatusUpdate={handleStatusUpdate}
                        onDelete={handleDeleteClick}
                    />
                </TabsContent>

                <TabsContent value="confirmed" className="mt-0">
                    <ReservationsTable
                        data={filteredReservations.filter(r => r.status === 'confirmed')}
                        onStatusUpdate={handleStatusUpdate}
                        onDelete={handleDeleteClick}
                    />
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!reservationToDelete} onOpenChange={(open) => !open && setReservationToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the reservation from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const ReservationsTable = ({ data, onStatusUpdate, onDelete }: { data: Reservation[], onStatusUpdate: (id: string, status: Reservation['status']) => void, onDelete: (id: string) => void }) => {
    if (data.length === 0) {
        return (
            <Card className="border-border/50 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-4 opacity-20" />
                    <p>No reservations found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border/50 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead>Guest</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Party Size</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((res) => (
                            <TableRow key={res.id} className="hover:bg-muted/20">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{res.name}</span>
                                        <span className="text-xs text-muted-foreground">ID: {String(res.id).slice(0, 8)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {new Date(res.date).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3 w-3" /> {res.time}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        {res.guests}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-sm">
                                        <span className="flex items-center gap-2"><Mail className="h-3 w-3" /> {res.email}</span>
                                        <span className="flex items-center gap-2"><Phone className="h-3 w-3" /> {res.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        res.status === 'confirmed' ? 'default' :
                                            res.status === 'pending' ? 'secondary' : 'destructive'
                                    } className={
                                        res.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                            res.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''
                                    }>
                                        {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {res.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => onStatusUpdate(res.id, 'confirmed')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => onStatusUpdate(res.id, 'cancelled')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Cancel
                                                </Button>
                                            </>
                                        )}
                                        {res.status === 'confirmed' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onStatusUpdate(res.id, 'completed')}
                                            >
                                                Complete
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(res.id)}
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
        </Card>
    );
};

export default ReservationsManagement;

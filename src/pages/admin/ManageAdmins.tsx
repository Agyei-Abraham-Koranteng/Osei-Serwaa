import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Trash2, Shield, Mail, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ManageAdmins = () => {
    const { users, addUser, deleteUser } = useRestaurant();
    const { toast } = useToast();

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin'
    });

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
            return;
        }

        await addUser(newUser as any);
        setNewUser({ username: '', email: '', password: '', role: 'admin' });
        toast({ title: '✨ Success', description: 'New admin user added successfully' });
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteUser(id);
            toast({ title: '✨ Success', description: 'User deleted successfully' });
        }
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Admin Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage system administrators and access</p>
                </div>
            </div>

            <Tabs defaultValue="list" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="list" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Users className="h-4 w-4 mr-2" />
                        Admins List
                    </TabsTrigger>
                    <TabsTrigger value="add" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add New Admin
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Current Administrators</CardTitle>
                            <CardDescription className="text-base">List of users with admin access</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="rounded-md border border-border/50 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead>Username</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/20">
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {user.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    {user.username}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add" className="mt-0">
                    <Card className="border-border/50 shadow-lg max-w-2xl mx-auto">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Create New Admin</CardTitle>
                            <CardDescription className="text-base">Grant admin access to a new user</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="username" className="text-base font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" /> Username
                                </Label>
                                <Input
                                    id="username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    placeholder="johndoe"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-base font-semibold flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-muted-foreground" /> Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <Button onClick={handleAddUser} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <UserPlus className="h-5 w-5 mr-2" />
                                Create Admin User
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ManageAdmins;

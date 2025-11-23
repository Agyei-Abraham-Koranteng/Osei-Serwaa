import { useState, useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Edit, Trash2, Utensils, Sparkles, Search } from 'lucide-react';
import { MenuItem } from '@/context/RestaurantContext';

const MenuManagement = () => {
    const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, heroTexts, setHeroText, heroImages, setHeroImage, categories } = useRestaurant();
    const { toast } = useToast();

    // Hero Section
    const [heroTitle, setHeroTitle] = useState(heroTexts?.menu?.title || 'Our Menu');
    const [heroSubtitle, setHeroSubtitle] = useState(heroTexts?.menu?.subtitle || '');
    const [heroImage, setHeroImageState] = useState(heroImages?.menu || '');

    // Menu Item Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'mains',
        categoryId: 'mains',
        image: '',
        featured: false,
        available: true,
        spicyLevel: 0,
    });

    // Search/Filter
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (heroTexts?.menu) {
            setHeroTitle(heroTexts.menu.title || 'Our Menu');
            setHeroSubtitle(heroTexts.menu.subtitle || '');
        }
    }, [heroTexts]);

    useEffect(() => {
        if (heroImages?.menu) {
            setHeroImageState(heroImages.menu);
        }
    }, [heroImages]);

    const handleSaveHero = () => {
        setHeroText('menu', { title: heroTitle, subtitle: heroSubtitle });
        if (heroImage) {
            setHeroImage('menu', heroImage);
        }
        toast({ title: '✨ Success', description: 'Hero section updated successfully' });
    };

    const handleOpenDialog = (item?: MenuItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                categoryId: item.categoryId,
                image: item.image,
                featured: item.featured,
                available: item.available,
                spicyLevel: item.spicyLevel,
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                category: 'mains',
                categoryId: 'mains',
                image: '',
                featured: false,
                available: true,
                spicyLevel: 0,
            });
        }
        setDialogOpen(true);
    };

    const handleSaveMenuItem = () => {
        if (editingItem) {
            updateMenuItem(editingItem.id, formData);
            toast({ title: '✨ Success', description: 'Menu item updated successfully' });
        } else {
            addMenuItem(formData as Omit<MenuItem, 'id'>);
            toast({ title: '✨ Success', description: 'Menu item added successfully' });
        }
        setDialogOpen(false);
    };

    const handleDeleteMenuItem = (id: string) => {
        if (confirm('Are you sure you want to delete this menu item?')) {
            deleteMenuItem(id);
            toast({ title: '✨ Success', description: 'Menu item deleted successfully' });
        }
    };

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 border border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Utensils className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Menu Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Manage menu items and page content</p>
                </div>
            </div>

            <Tabs defaultValue="items" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="items" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Utensils className="h-4 w-4 mr-2" />
                        Menu Items
                    </TabsTrigger>
                    <TabsTrigger value="hero" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Hero Section
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Hero Content</CardTitle>
                            <CardDescription className="text-base">Edit the hero section of the menu page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="hero-title" className="text-base font-semibold">Title</Label>
                                <Input
                                    id="hero-title"
                                    value={heroTitle}
                                    onChange={(e) => setHeroTitle(e.target.value)}
                                    placeholder="Our Menu"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="hero-subtitle" className="text-base font-semibold">Subtitle</Label>
                                <Textarea
                                    id="hero-subtitle"
                                    value={heroSubtitle}
                                    onChange={(e) => setHeroSubtitle(e.target.value)}
                                    placeholder="Explore our selection of authentic Ghanaian dishes"
                                    rows={2}
                                    className="text-base border-border/50 focus:border-primary/50 resize-none"
                                />
                            </div>

                            <ImageUpload
                                label="Hero Background Image"
                                value={heroImage}
                                onChange={setHeroImageState}
                            />

                            <Button onClick={handleSaveHero} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />
                                Save Hero Section
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="items" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl">Menu Items</CardTitle>
                                    <CardDescription className="text-base">Manage all menu items</CardDescription>
                                </div>
                                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => handleOpenDialog()} variant="premium" className="shadow-md">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Menu Item
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                                            <DialogDescription>Fill in the details for the menu item</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label className="font-semibold">Name</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Dish name"
                                                    className="h-10"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-semibold">Description</Label>
                                                <Textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    placeholder="Dish description"
                                                    rows={3}
                                                    className="resize-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="font-semibold">Price (GHS)</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                        placeholder="0.00"
                                                        step="0.01"
                                                        className="h-10"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="font-semibold">Category</Label>
                                                    <select
                                                        className="w-full h-10 px-3 py-2 border rounded-md bg-background border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={formData.categoryId}
                                                        onChange={(e) => {
                                                            const cat = categories.find(c => c.id === e.target.value);
                                                            setFormData({
                                                                ...formData,
                                                                categoryId: e.target.value,
                                                                category: cat?.name || e.target.value
                                                            });
                                                        }}
                                                    >
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="font-semibold">Spicy Level (0-3)</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="3"
                                                        value={formData.spicyLevel}
                                                        onChange={(e) => setFormData({ ...formData, spicyLevel: parseInt(e.target.value) })}
                                                        className="h-10"
                                                    />
                                                </div>

                                                <div className="space-y-2 pt-8">
                                                    <div className="flex gap-6">
                                                        <Label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                                                                checked={formData.featured}
                                                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                            />
                                                            Featured
                                                        </Label>
                                                        <Label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-primary text-primary focus:ring-primary"
                                                                checked={formData.available}
                                                                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                                            />
                                                            Available
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>

                                            <ImageUpload
                                                label="Dish Image"
                                                value={formData.image}
                                                onChange={(url) => setFormData({ ...formData, image: url })}
                                            />

                                            <Button onClick={handleSaveMenuItem} className="w-full h-12 text-base font-semibold" variant="premium">
                                                <Save className="h-5 w-5 mr-2" />
                                                {editingItem ? 'Update' : 'Add'} Menu Item
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search menu items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>

                            <div className="rounded-md border border-border/50 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredItems.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/20">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {item.image && (
                                                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                                                        )}
                                                        {item.name}
                                                        {item.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">Featured</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>GHS {item.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {item.available ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleOpenDialog(item)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteMenuItem(item.id)}
                                                            className="h-8 w-8 p-0"
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
                            {filteredItems.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    No menu items found matching your search.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MenuManagement;

import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MenuItem } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const MenuManagement = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useRestaurant();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    categoryId: '',
    image: '',
    featured: false,
    available: true,
    spicyLevel: '0',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      categoryId: '',
      image: '',
      featured: false,
      available: true,
      spicyLevel: '0',
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      categoryId: item.categoryId,
      image: item.image,
      featured: item.featured,
      available: item.available,
      spicyLevel: item.spicyLevel.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const category = categories.find((c) => c.id === formData.categoryId);
    if (!category) return;

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: category.name,
      categoryId: formData.categoryId,
      image: formData.image,
      featured: formData.featured,
      available: formData.available,
      spicyLevel: parseInt(formData.spicyLevel),
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
      toast({
        title: 'Item updated',
        description: 'Menu item has been updated successfully.',
      });
    } else {
      addMenuItem(itemData);
      toast({
        title: 'Item added',
        description: 'New menu item has been added successfully.',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMenuItem(id);
      toast({
        title: 'Item deleted',
        description: 'Menu item has been deleted successfully.',
      });
    }
  };

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
            <h1 className="text-4xl font-bold text-white mb-2">Menu Management</h1>
            <p className="text-white/90">Manage your restaurant menu items</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name *</Label>
                <Input
                  id="item-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-price">Price (GH₵) *</Label>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => {
                      const category = categories.find((c) => c.id === value);
                      setFormData({
                        ...formData,
                        categoryId: value,
                        category: category?.name || '',
                      });
                    }}
                  >
                    <SelectTrigger id="item-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-spicy">Spicy Level</Label>
                <Select
                  value={formData.spicyLevel}
                  onValueChange={(value) => setFormData({ ...formData, spicyLevel: value })}
                >
                  <SelectTrigger id="item-spicy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not Spicy</SelectItem>
                    <SelectItem value="1">Mild</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">Hot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-image">Image URL</Label>
                <Input
                  id="item-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Optional - leave empty for default icon"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <Label htmlFor="item-featured">Featured Item</Label>
                <Switch
                  id="item-featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <Label htmlFor="item-available">Available</Label>
                <Switch
                  id="item-available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">GH₵ {item.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1 gap-2">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id, item.name)}
                  className="flex-1 gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;

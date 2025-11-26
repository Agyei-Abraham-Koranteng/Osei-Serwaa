import { useState, useEffect } from 'react';
import { useRestaurant, FooterContent } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Link as LinkIcon, Type, Facebook, Instagram, Twitter, LayoutTemplate } from 'lucide-react';

const FooterManagement = () => {
    const { footerContent, setFooterContent } = useRestaurant();
    const { toast } = useToast();
    const [localContent, setLocalContent] = useState<FooterContent>(footerContent);

    useEffect(() => {
        if (footerContent) {
            setLocalContent(footerContent);
        }
    }, [footerContent]);

    const handleSave = () => {
        setFooterContent(localContent);
        toast({
            title: '✨ Success',
            description: 'Footer content updated successfully',
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
                            <LayoutTemplate className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Footer Management
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-[60px]">Customize site footer and social links</p>
                </div>
            </div>

            <Tabs defaultValue="content" className="w-full space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="content" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <Type className="h-4 w-4 mr-2" />
                        Content
                    </TabsTrigger>
                    <TabsTrigger value="social" className="h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:text-accent data-[state=active]:shadow-sm text-base font-medium transition-all">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Social Links
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Footer Content</CardTitle>
                            <CardDescription className="text-base">Edit the text displayed in the footer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-base font-semibold">About Description</Label>
                                <Textarea
                                    id="description"
                                    value={localContent.description}
                                    onChange={(e) => setLocalContent({ ...localContent, description: e.target.value })}
                                    placeholder="Short description about the restaurant..."
                                    rows={3}
                                    className="text-base border-border/50 focus:border-primary/50 resize-none"
                                />
                                <p className="text-sm text-muted-foreground">This text appears in the main footer column.</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="copyright" className="text-base font-semibold">Copyright Text</Label>
                                <Input
                                    id="copyright"
                                    value={localContent.copyrightText}
                                    onChange={(e) => setLocalContent({ ...localContent, copyrightText: e.target.value })}
                                    placeholder="© 2024 Osei Serwaa Kitchen. All rights reserved."
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <Button onClick={handleSave} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />
                                Save Content
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="social" className="mt-0">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-muted/30 to-background border-b border-border/50">
                            <CardTitle className="text-2xl">Social Media Links</CardTitle>
                            <CardDescription className="text-base">Manage links to your social media profiles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-3">
                                <Label htmlFor="tiktok" className="text-base font-semibold flex items-center gap-2">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                    TikTok URL
                                </Label>
                                <Input
                                    id="tiktok"
                                    value={localContent.socialLinks.tiktok}
                                    onChange={(e) => setLocalContent({
                                        ...localContent,
                                        socialLinks: { ...localContent.socialLinks, tiktok: e.target.value }
                                    })}
                                    placeholder="https://tiktok.com/@oseiserwaakitchen"
                                    className="h-12 text-base border-border/50 focus:border-primary/50"
                                />
                            </div>

                            <Button onClick={handleSave} className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all" variant="premium">
                                <Save className="h-5 w-5 mr-2" />
                                Save Social Links
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FooterManagement;

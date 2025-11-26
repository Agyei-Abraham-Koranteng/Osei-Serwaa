import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
    label?: string;
    value?: string; // Current image URL or data URL
    onChange: (imageUrl: string) => void;
    onImageIdChange?: (imageId: number | null) => void;
}

export const ImageUpload = ({ label = 'Image', value, onChange, onImageIdChange }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(value || '');
    const [useUrl, setUseUrl] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    // Sync preview with value prop changes
    useEffect(() => {
        setPreview(value || '');
    }, [value]);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid file type',
                description: 'Please select an image file',
                variant: 'destructive',
            });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Image must be less than 5MB',
                variant: 'destructive',
            });
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            onChange(publicUrl);
            if (onImageIdChange) {
                // Supabase Storage doesn't use numeric IDs like the local DB, passing null or handling differently
                // If the parent component expects a numeric ID, we might need to adjust that expectation
                onImageIdChange(null);
            }
            setPreview(publicUrl);

            toast({
                title: 'Success',
                description: 'Image uploaded successfully',
            });
        } catch (error: any) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload failed',
                description: error.message || 'Failed to upload image. Please try again.',
                variant: 'destructive',
            });
            setPreview('');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) return;

        // Validate URL format
        try {
            new URL(urlInput);
            setPreview(urlInput);
            onChange(urlInput);
            if (onImageIdChange) {
                onImageIdChange(null);
            }
            toast({
                title: 'Success',
                description: 'Image URL set successfully',
            });
        } catch {
            toast({
                title: 'Invalid URL',
                description: 'Please enter a valid image URL',
                variant: 'destructive',
            });
        }
    };

    const handleClear = () => {
        setPreview('');
        setUrlInput('');
        onChange('');
        if (onImageIdChange) {
            onImageIdChange(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <Label>{label}</Label>

            {/* Toggle between upload and URL */}
            <div className="flex gap-2 mb-2">
                <Button
                    type="button"
                    variant={!useUrl ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseUrl(false)}
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                </Button>
                <Button
                    type="button"
                    variant={useUrl ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseUrl(true)}
                >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Use URL
                </Button>
            </div>

            {/* File Upload */}
            {!useUrl && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Image
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* URL Input */}
            {useUrl && (
                <div className="flex gap-2">
                    <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    />
                    <Button type="button" onClick={handleUrlSubmit}>
                        Set
                    </Button>
                </div>
            )}

            {/* Preview */}
            {preview && (
                <div className="relative border rounded-lg p-2 bg-muted/30">
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                        onError={() => {
                            toast({
                                title: 'Image load failed',
                                description: 'Failed to load image preview',
                                variant: 'destructive',
                            });
                        }}
                    />
                </div>
            )}
        </div>
    );
};

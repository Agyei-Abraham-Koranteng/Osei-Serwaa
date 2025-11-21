import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import heroImage from '@/assets/hero-restaurant.jpg';

const AboutContentManagement = () => {
  const { toast } = useToast();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newTeam = [...team];
      newTeam[index].image = reader.result as string;
      setTeam(newTeam);
      toast({
        title: 'Image uploaded!',
        description: 'Team member photo has been updated.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    const newTeam = [...team];
    newTeam[index].image = '';
    setTeam(newTeam);
  };
  
  const [story, setStory] = useState({
    paragraph1: 'Osei Serwaa Kitchen was founded with a simple mission: to share the rich culinary heritage of Ghana with food lovers everywhere. Our restaurant is named after our founder\'s grandmother, Osei Serwaa, whose recipes and cooking techniques have been passed down through generations.',
    paragraph2: 'Every dish we serve is prepared using traditional methods and authentic ingredients, ensuring that each bite transports you to the vibrant streets and warm kitchens of Ghana. From our signature jollof rice to our perfectly seasoned banku, we take pride in maintaining the authentic flavors that have made Ghanaian cuisine beloved worldwide.',
    paragraph3: 'Our commitment to quality, authenticity, and excellent service has made us a favorite destination for those seeking genuine Ghanaian food. Whether you\'re from Ghana or discovering these flavors for the first time, we invite you to experience the warmth and hospitality that define our kitchen.',
  });

  const [values, setValues] = useState([
    { title: 'Authenticity', description: 'We stay true to traditional recipes and cooking methods' },
    { title: 'Quality', description: 'Only the freshest ingredients make it to your plate' },
    { title: 'Community', description: 'We bring people together through food and culture' },
    { title: 'Excellence', description: 'Every dish is prepared with care and passion' },
  ]);

  const [team, setTeam] = useState([
    { name: 'Kwame Osei', role: 'Head Chef', description: 'With 20 years of experience in traditional Ghanaian cooking', image: '' },
    { name: 'Akosua Mensah', role: 'Restaurant Manager', description: 'Ensuring every guest feels at home in our kitchen', image: '' },
    { name: 'Kofi Asante', role: 'Sous Chef', description: 'Bringing innovation while respecting tradition', image: '' },
  ]);

  const handleSave = () => {
    toast({
      title: 'Changes saved!',
      description: 'About page content has been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
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
            <h1 className="text-4xl font-bold text-white mb-2">About Content Management</h1>
            <p className="text-white/90">Manage the content displayed on the about page</p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="story-p1">Paragraph 1</Label>
            <Textarea
              id="story-p1"
              value={story.paragraph1}
              onChange={(e) => setStory({ ...story, paragraph1: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-p2">Paragraph 2</Label>
            <Textarea
              id="story-p2"
              value={story.paragraph2}
              onChange={(e) => setStory({ ...story, paragraph2: e.target.value })}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-p3">Paragraph 3</Label>
            <Textarea
              id="story-p3"
              value={story.paragraph3}
              onChange={(e) => setStory({ ...story, paragraph3: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <Card>
        <CardHeader>
          <CardTitle>Our Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {values.map((value, index) => (
            <div key={index} className="border-b pb-6 last:border-0">
              <h3 className="font-semibold mb-3">Value {index + 1}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`value-title-${index}`}>Title</Label>
                  <Input
                    id={`value-title-${index}`}
                    value={value.title}
                    onChange={(e) => {
                      const newValues = [...values];
                      newValues[index].title = e.target.value;
                      setValues(newValues);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`value-desc-${index}`}>Description</Label>
                  <Input
                    id={`value-desc-${index}`}
                    value={value.description}
                    onChange={(e) => {
                      const newValues = [...values];
                      newValues[index].description = e.target.value;
                      setValues(newValues);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {team.map((member, index) => (
            <div key={index} className="border-b pb-6 last:border-0">
              <h3 className="font-semibold mb-3">Team Member {index + 1}</h3>
              <div className="space-y-4">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {member.image ? (
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-border">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 border-2 border-dashed border-border flex items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                        }}
                        className="hidden"
                        id={`team-image-${index}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {member.image ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Recommended: Square image, at least 400x400px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`team-name-${index}`}>Name</Label>
                    <Input
                      id={`team-name-${index}`}
                      value={member.name}
                      onChange={(e) => {
                        const newTeam = [...team];
                        newTeam[index].name = e.target.value;
                        setTeam(newTeam);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`team-role-${index}`}>Role</Label>
                    <Input
                      id={`team-role-${index}`}
                      value={member.role}
                      onChange={(e) => {
                        const newTeam = [...team];
                        newTeam[index].role = e.target.value;
                        setTeam(newTeam);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`team-desc-${index}`}>Description</Label>
                  <Textarea
                    id={`team-desc-${index}`}
                    value={member.description}
                    onChange={(e) => {
                      const newTeam = [...team];
                      newTeam[index].description = e.target.value;
                      setTeam(newTeam);
                    }}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default AboutContentManagement;

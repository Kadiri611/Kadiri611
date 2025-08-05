import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useFooterLinks, FooterLink } from '@/hooks/useFooterLinks';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SOCIAL_ICONS = [
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'LinkedIn', icon: 'linkedin' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'GitHub', icon: 'github' }
];

const NAVIGATION_GROUPS = ['Company', 'Product', 'Resources', 'Support'];

export function FooterManager() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { 
    links, 
    loading, 
    createLink, 
    updateLink, 
    deleteLink, 
    getNavigationByGroup, 
    getSocialLinks 
  } = useFooterLinks();

  const [isOpen, setIsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [formData, setFormData] = useState({
    link_type: 'navigation' as 'navigation' | 'social',
    title: '',
    url: '',
    section_group: '',
    icon_name: ''
  });

  if (!isAdmin) return null;

  const resetForm = () => {
    setFormData({
      link_type: 'navigation',
      title: '',
      url: '',
      section_group: '',
      icon_name: ''
    });
    setEditingLink(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingLink) {
        await updateLink(editingLink.id, {
          title: formData.title,
          url: formData.url,
          section_group: formData.section_group,
          icon_name: formData.icon_name
        });
        toast.success('Link updated successfully!');
      } else {
        // Get max display_order for the group
        const existingLinks = formData.link_type === 'social' 
          ? getSocialLinks() 
          : links.filter(l => l.section_group === formData.section_group);
        
        const maxOrder = Math.max(...existingLinks.map(l => l.display_order), 0);
        
        await createLink({
          ...formData,
          display_order: maxOrder + 1,
          is_active: true
        });
        toast.success('Link created successfully!');
      }
      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save link');
    }
  };

  const handleEdit = (link: FooterLink) => {
    setEditingLink(link);
    setFormData({
      link_type: link.link_type,
      title: link.title,
      url: link.url,
      section_group: link.section_group || '',
      icon_name: link.icon_name || ''
    });
    setIsOpen(true);
  };

  const handleDelete = async (link: FooterLink) => {
    if (!confirm(`Are you sure you want to delete "${link.title}"?`)) return;
    
    try {
      await deleteLink(link.id);
      toast.success('Link deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete link');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.index === destination.index && source.droppableId === destination.droppableId) return;

    try {
      // Update display order based on new position
      await updateLink(draggableId, { display_order: destination.index + 1 });
      toast.success('Link order updated!');
    } catch (error) {
      toast.error('Failed to update link order');
    }
  };

  const navigationGroups = getNavigationByGroup();
  const socialLinks = getSocialLinks().sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogTrigger asChild>
          <Button className="rounded-full shadow-lg">
            Manage Footer
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Footer Management</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="navigation" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="navigation">Navigation Links</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </TabsList>

            <TabsContent value="navigation" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Navigation Links</h3>
                <Button 
                  onClick={() => {
                    setFormData({ ...formData, link_type: 'navigation' });
                    setIsOpen(true);
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Navigation Link
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                {NAVIGATION_GROUPS.map(group => (
                  <Card key={group}>
                    <CardHeader>
                      <CardTitle className="text-base">{group}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={group}>
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {(navigationGroups[group] || []).map((link, index) => (
                              <Draggable key={link.id} draggableId={link.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-background"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <div className="font-medium">{link.title}</div>
                                        <div className="text-sm text-muted-foreground flex items-center">
                                          <ExternalLink className="w-3 h-3 mr-1" />
                                          {link.url}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(link)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(link)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                ))}
              </DragDropContext>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <Button 
                  onClick={() => {
                    setFormData({ ...formData, link_type: 'social' });
                    setIsOpen(true);
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Social Link
                </Button>
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="social">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {socialLinks.map((link, index) => (
                        <Draggable key={link.id} draggableId={link.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-background"
                            >
                              <div className="flex items-center space-x-2">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <div className="font-medium">{link.title}</div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    {link.url}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(link)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(link)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Link Dialog */}
      <Dialog open={isOpen && (editingLink !== null || formData.title !== '')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Link' : `Add ${formData.link_type === 'social' ? 'Social' : 'Navigation'} Link`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Link title"
              />
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>

            {formData.link_type === 'navigation' && (
              <div>
                <Label htmlFor="section_group">Section</Label>
                <Select 
                  value={formData.section_group} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, section_group: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {NAVIGATION_GROUPS.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.link_type === 'social' && (
              <div>
                <Label htmlFor="icon_name">Icon</Label>
                <Select 
                  value={formData.icon_name} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_ICONS.map(icon => (
                      <SelectItem key={icon.icon} value={icon.icon}>{icon.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingLink ? 'Update' : 'Create'} Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { usePages, Page } from '@/hooks/usePages';
import { toast } from 'sonner';

export function PageManager() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { pages, createPage, updatePage, deletePage, loading } = usePages();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: true
  });

  if (!isAdmin) return null;

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      is_published: true
    });
  };

  const handleCreate = async () => {
    try {
      await createPage({
        ...formData,
        created_by: user?.id
      });
      toast.success('Page created successfully!');
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create page');
    }
  };

  const handleUpdate = async () => {
    if (!editingPage) return;
    
    try {
      await updatePage(editingPage.id, formData);
      toast.success('Page updated successfully!');
      setEditingPage(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to update page');
    }
  };

  const handleDelete = async (page: Page) => {
    if (!confirm(`Are you sure you want to delete "${page.title}"?`)) return;
    
    try {
      await deletePage(page.id);
      toast.success('Page deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const openEditDialog = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || '',
      meta_description: page.meta_description || '',
      is_published: page.is_published
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Page
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page Management</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Create New Page Button */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Page
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          title,
                          slug: generateSlug(title)
                        }));
                      }}
                      placeholder="Page title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-url-slug"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Page content (HTML allowed)"
                      rows={6}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO meta description"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreate}>Create Page</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Pages List */}
            <div className="space-y-2">
              <h3 className="font-semibold">Existing Pages ({pages.length})</h3>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <p>Loading pages...</p>
                </div>
              ) : pages.length === 0 ? (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">No pages created yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Click "Create New Page" to get started.</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex-1">
                        <h4 className="font-medium">{page.title}</h4>
                        <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            page.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {page.is_published ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Created: {new Date(page.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(page)}
                          title="Edit page"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(page)}
                          title="Delete page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Page title"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-slug">URL Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="page-url-slug"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Page content (HTML allowed)"
                rows={6}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-meta_description">Meta Description</Label>
              <Textarea
                id="edit-meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="SEO meta description"
                rows={2}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="edit-is_published">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Update Page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
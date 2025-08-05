import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Save, ArrowLeft, Edit } from 'lucide-react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminFAQ() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order');

      if (error) {
        console.error('Error fetching FAQs:', error);
        toast.error('Failed to load FAQs');
      } else {
        setFaqs(data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSaveFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert({
          question: newFaq.question.trim(),
          answer: newFaq.answer.trim(),
          display_order: faqs.length + 1,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setFaqs([...faqs, data]);
      setNewFaq({ question: '', answer: '' });
      toast.success('FAQ added successfully!');
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setFaqs(faqs.filter(faq => faq.id !== id));
      toast.success('FAQ deleted successfully!');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setNewFaq({ question: faq.question, answer: faq.answer });
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq || !newFaq.question.trim() || !newFaq.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update({
          question: newFaq.question.trim(),
          answer: newFaq.answer.trim()
        })
        .eq('id', editingFaq.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setFaqs(faqs.map(faq => faq.id === editingFaq.id ? data : faq));
      setEditingFaq(null);
      setNewFaq({ question: '', answer: '' });
      toast.success('FAQ updated successfully!');
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast.error('Failed to update FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
    setNewFaq({ question: '', answer: '' });
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/settings" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Manage FAQ</h1>
          <p className="text-muted-foreground mt-2">
            Manage frequently asked questions for your pricing page
          </p>
        </div>

        {/* Add New FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                placeholder="Enter the question"
              />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={editingFaq ? handleUpdateFaq : handleSaveFaq} 
                disabled={saving}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : editingFaq ? 'Update FAQ' : 'Save FAQ'}
              </Button>
              {editingFaq && (
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading FAQs...</p>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No FAQs found</p>
                <Badge variant="outline">Add your first FAQ above</Badge>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Order: {faq.display_order}
                            </Badge>
                            <Badge variant={faq.is_active ? "default" : "secondary"} className="text-xs">
                              {faq.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditFaq(faq)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteFaq(faq.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
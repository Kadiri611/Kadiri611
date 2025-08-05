import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Palette, FileText, Link, HelpCircle, Package } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useUserRole } from "@/hooks/useUserRole";

interface AdminManagementCardProps {
  user: User;
}

const AdminManagementCard = ({ user }: AdminManagementCardProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole(user);

  if (!isAdmin) return null;

  const adminTools = [
    {
      title: "Brand Management",
      description: "Manage business logo, name, and brand colors",
      icon: Palette,
      path: "/admin/branding",
      color: "text-purple-600"
    },
    {
      title: "Page Management", 
      description: "Create and manage dynamic pages",
      icon: FileText,
      path: "/admin/pages",
      color: "text-blue-600"
    },
    {
      title: "Footer Management",
      description: "Manage footer links and social media",
      icon: Link,
      path: "/admin/footer",
      color: "text-green-600"
    },
    {
      title: "FAQ Management",
      description: "Add and manage frequently asked questions", 
      icon: HelpCircle,
      path: "/admin/faq",
      color: "text-orange-600"
    },
    {
      title: "Pricing Management",
      description: "Manage pricing packages and content",
      icon: Package,
      path: "/admin/packages", 
      color: "text-red-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Website Administration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Manage your website's branding, content, and structure.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminTools.map((tool) => (
            <div key={tool.path} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <tool.icon className={`w-5 h-5 mt-0.5 ${tool.color}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {tool.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(tool.path)}
                    className="w-full"
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminManagementCard;
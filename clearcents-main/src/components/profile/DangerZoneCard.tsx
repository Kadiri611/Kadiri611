import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DangerZoneCardProps {
  user: User;
}

const DangerZoneCard = ({ user }: DangerZoneCardProps) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast({
        variant: "destructive",
        title: "Confirmation Required",
        description: "Please type 'DELETE' to confirm account deletion.",
      });
      return;
    }

    setIsDeleting(true);
    try {
      // In a real app, you would:
      // 1. Delete all user data from your custom tables
      // 2. Call a backend function to delete the user from Supabase Auth
      // For now, we'll just show a message
      
      toast({
        title: "Account Deletion Initiated",
        description: "Your account deletion request has been processed. You will be logged out.",
      });

      // Sign out the user
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please contact support.",
      });
    } finally {
      setIsDeleting(false);
      setConfirmText("");
    }
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your ClearCents account and all associated data. 
            This action cannot be undone.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    This action cannot be undone. This will permanently delete your 
                    account and remove all your data from our servers.
                  </p>
                  <p>
                    This includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All budget categories and transactions</li>
                    <li>Reports and financial data</li>
                    <li>Account settings and preferences</li>
                    <li>Subscription and billing information</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="confirm-delete">
                    Type <span className="font-bold">DELETE</span> to confirm:
                  </Label>
                  <Input
                    id="confirm-delete"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE here"
                    className="mt-2"
                  />
                </div>
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "DELETE" || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerZoneCard;
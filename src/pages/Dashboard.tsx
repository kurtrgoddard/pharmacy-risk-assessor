
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';
import AppHeader from '@/components/ui/AppHeader';
import AppFooter from '@/components/ui/AppFooter';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, signOut } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      toast({
        title: "Unauthorized",
        description: "Please sign in to access the dashboard.",
        variant: "destructive",
      });
      navigate('/');
    } else {
      setIsLoading(false);
    }
  }, [session, navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Welcome to Your Dashboard</CardTitle>
              <CardDescription>Manage your account and settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>User ID:</strong> {session?.user.id}
              </p>
              <p>
                <strong>Email:</strong> {session?.user.email}
              </p>
              <Button onClick={() => navigate('/napra-assessment')}>
                Start New Assessment
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  signOut();
                  toast({
                    title: "Signed out",
                    description: "You have been successfully signed out.",
                  });
                }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Dashboard;

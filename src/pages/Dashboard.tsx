
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';
import { ArrowLeft, FileText, Shield, Home, Save } from 'lucide-react';
import AppHeader from '@/components/ui/AppHeader';
import AppFooter from '@/components/ui/AppFooter';
import SavedAssessments from '@/components/SavedAssessments';
import { RiskAssessmentData } from '@/lib/validators/risk-assessment';

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

  const handleLoadAssessment = (data: RiskAssessmentData) => {
    // Store the loaded data in sessionStorage to pass to the assessment page
    sessionStorage.setItem('loadedAssessment', JSON.stringify(data));
    navigate('/napra-assessment');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center">
            <Button variant="outline" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="saved">Saved Assessments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>User ID:</strong> {session?.user.id}</p>
                    <p><strong>Email:</strong> {session?.user.email}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Tools</CardTitle>
                    <CardDescription>Access risk assessment forms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => navigate('/napra-assessment')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Standard Assessment
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/secure-napra-assessment')}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Secure Assessment
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>Manage your session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Return to Home
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
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
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Save className="mr-2 h-5 w-5" />
                    Saved Assessments
                  </CardTitle>
                  <CardDescription>
                    Manage your saved risk assessments. Load previous assessments to save time on repeated compounds.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SavedAssessments onLoadAssessment={handleLoadAssessment} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WelcomeEmailTemplate from '@/components/emails/WelcomeEmailTemplate';
import ProductUpdateTemplate from '@/components/emails/ProductUpdateTemplate';
import LaunchAnnouncementTemplate from '@/components/emails/LaunchAnnouncementTemplate';
import EarlyBirdOfferTemplate from '@/components/emails/EarlyBirdOfferTemplate';
import ReactDOMServer from 'react-dom/server';

const AdminEmails: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [previewMode, setPreviewMode] = useState<'preview' | 'html'>('preview');
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === 'pharmassess2024') {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Invalid password",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (html: string) => {
    navigator.clipboard.writeText(html);
    toast({
      title: "HTML copied to clipboard",
      description: "You can now paste this into your email service"
    });
  };

  const downloadHTML = (html: string, filename: string) => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderTemplate = (template: React.ReactElement, title: string) => {
    const html = ReactDOMServer.renderToStaticMarkup(template);
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                {title}
              </CardTitle>
              <CardDescription>
                Preview and export this email template
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(previewMode === 'preview' ? 'html' : 'preview')}
              >
                <Eye className="h-4 w-4 mr-1" />
                {previewMode === 'preview' ? 'View HTML' : 'View Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(html)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy HTML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadHTML(html, title.toLowerCase().replace(/\s+/g, '-'))}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {previewMode === 'preview' ? (
            <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
              {template}
            </div>
          ) : (
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">{html}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Email Templates</CardTitle>
            <CardDescription>Enter password to preview email templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Email Template Manager</h1>
          <p className="text-gray-600">Preview and export email templates for your email service</p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">How to Use These Templates</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ol className="list-decimal list-inside space-y-2">
              <li>Preview each template below to see how it will look</li>
              <li>Click "Copy HTML" to copy the template code to your clipboard</li>
              <li>Paste the HTML into your email service (Resend, SendGrid, Mailchimp, etc.)</li>
              <li>Replace variables like {'{name}'} and {'{position}'} with actual data</li>
              <li>Test send to yourself before sending to your waitlist</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="font-semibold">Variable Examples:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li><code>{'{name}'}</code> → "Dr. Sarah Johnson"</li>
                <li><code>{'{position}'}</code> → "23"</li>
                <li><code>{'{earlyAccessUrl}'}</code> → "https://app.pharmassess.com/signup?early=true"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="welcome" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="welcome">Welcome Email</TabsTrigger>
            <TabsTrigger value="update">Product Update</TabsTrigger>
            <TabsTrigger value="launch">Launch Announcement</TabsTrigger>
            <TabsTrigger value="offer">Early Bird Offer</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome">
            {renderTemplate(
              <WelcomeEmailTemplate
                name="Dr. Sarah Johnson"
                position={23}
                unsubscribeUrl="https://pharmassess.com/unsubscribe?token=xyz"
              />,
              "Welcome Email Template"
            )}
          </TabsContent>

          <TabsContent value="update">
            {renderTemplate(
              <ProductUpdateTemplate
                name="Dr. Sarah Johnson"
                updateTitle="Major Progress Update - Beta Testing Begins!"
                updateContent="We're excited to share that PharmAssess has reached a major milestone! Our beta version is now complete and we're beginning testing with select pharmacy partners. The response has been overwhelmingly positive, with testers reporting 95% time savings on their risk assessments."
                features={[
                  "Real-time hazard data integration with PubChem and NIOSH",
                  "Automated NAPRA compliance checking",
                  "Professional PDF report generation",
                  "Multi-user team collaboration features"
                ]}
                progressPercentage={75}
                unsubscribeUrl="https://pharmassess.com/unsubscribe?token=xyz"
              />,
              "Product Update Template"
            )}
          </TabsContent>

          <TabsContent value="launch">
            {renderTemplate(
              <LaunchAnnouncementTemplate
                name="Dr. Sarah Johnson"
                position={23}
                earlyAccessUrl="https://app.pharmassess.com/signup?early=true&token=xyz"
                unsubscribeUrl="https://pharmassess.com/unsubscribe?token=xyz"
              />,
              "Launch Announcement Template"
            )}
          </TabsContent>

          <TabsContent value="offer">
            {renderTemplate(
              <EarlyBirdOfferTemplate
                name="Dr. Sarah Johnson"
                discountPercentage={50}
                originalPrice={299}
                discountedPrice={149}
                expirationDate="December 31, 2024"
                ctaUrl="https://app.pharmassess.com/signup?discount=EARLY50&token=xyz"
                unsubscribeUrl="https://pharmassess.com/unsubscribe?token=xyz"
              />,
              "Early Bird Offer Template"
            )}
          </TabsContent>
        </Tabs>

        {/* Email Service Integration Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Email Service Integration</CardTitle>
            <CardDescription>How to use these templates with popular email services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Resend (Recommended)</h4>
                <pre className="text-sm bg-gray-100 p-3 rounded-lg overflow-x-auto">
{`import { Resend } from 'resend';

const resend = new Resend('your-api-key');

await resend.emails.send({
  from: 'team@pharmassess.com',
  to: user.email,
  subject: 'Welcome to PharmAssess!',
  html: welcomeEmailHTML
});`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SendGrid</h4>
                <pre className="text-sm bg-gray-100 p-3 rounded-lg overflow-x-auto">
{`const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: user.email,
  from: 'team@pharmassess.com',
  subject: 'Welcome to PharmAssess!',
  html: welcomeEmailHTML,
};

await sgMail.send(msg);`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminEmails;

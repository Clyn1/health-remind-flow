
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Smartphone, MessageSquare, Mail, Send, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  channel: string;
  status: 'success' | 'failed';
  message: string;
  timestamp: Date;
}

const TestMessagingPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [testMessage, setTestMessage] = useState("Hello! This is a test message from HealthRemind.");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const sendTestMessage = async (channel: 'sms' | 'whatsapp' | 'email') => {
    if (!phoneNumber && (channel === 'sms' || channel === 'whatsapp')) {
      toast({
        title: "Phone number required",
        description: "Please enter a phone number to test SMS or WhatsApp",
        variant: "destructive",
      });
      return;
    }

    if (!email && channel === 'email') {
      toast({
        title: "Email required",
        description: "Please enter an email address to test email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-test-message', {
        body: {
          channel,
          phoneNumber: channel !== 'email' ? phoneNumber : undefined,
          email: channel === 'email' ? email : undefined,
          message: testMessage,
        },
      });

      if (error) throw error;

      const result: TestResult = {
        channel,
        status: data.success ? 'success' : 'failed',
        message: data.message || data.error || 'Unknown response',
        timestamp: new Date(),
      };

      setResults(prev => [result, ...prev]);

      toast({
        title: result.status === 'success' ? "Message sent!" : "Message failed",
        description: result.message,
        variant: result.status === 'success' ? "default" : "destructive",
      });

    } catch (error: any) {
      const result: TestResult = {
        channel,
        status: 'failed',
        message: error.message || 'Failed to send message',
        timestamp: new Date(),
      };

      setResults(prev => [result, ...prev]);

      toast({
        title: "Error",
        description: error.message || 'Failed to send test message',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Test Messaging</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., +1 for US)
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Test Message</label>
              <Textarea
                placeholder="Enter your test message here..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Send Test Message Via:</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => sendTestMessage('sms')}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button
                  onClick={() => sendTestMessage('whatsapp')}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => sendTestMessage('email')}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tests run yet. Click the buttons to test your messaging setup.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {result.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                          {result.channel.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">SMS Setup (Twilio)</h3>
            <p className="text-sm text-muted-foreground">
              You need to configure your Twilio credentials in the Settings page under Integrations.
              Make sure you have a verified Twilio phone number and account.
            </p>
          </div>
          <div>
            <h3 className="font-medium">WhatsApp Setup</h3>
            <p className="text-sm text-muted-foreground">
              WhatsApp Business API requires approval from Meta. For testing, you can use Twilio's 
              WhatsApp sandbox or set up a proper WhatsApp Business account.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Email Setup</h3>
            <p className="text-sm text-muted-foreground">
              Configure your SMTP settings in the Settings page. For production, consider using 
              services like SendGrid, Mailgun, or AWS SES.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestMessagingPage;

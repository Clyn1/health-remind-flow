
import { useState, useEffect } from "react";
import {
  BellRing,
  CheckCircle,
  Clock,
  Smartphone,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
  Search,
  RefreshCcw,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format, addHours } from "date-fns";

interface Reminder {
  id: string;
  patientName: string;
  channel: "sms" | "email" | "voice" | "app" | "whatsapp";
  status: "pending" | "sent" | "delivered" | "read" | "responded" | "failed";
  scheduledTime: string;
  sentTime?: string;
  appointmentType: string;
  response?: string;
}

const RemindersPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // In a real app, you'd fetch reminders from Supabase here
        // For demo purposes, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock reminders
        const mockReminders: Reminder[] = [];
        const statuses = ["pending", "sent", "delivered", "read", "responded", "failed"];
        const channels = ["sms", "email", "voice", "app", "whatsapp"];
        const appointmentTypes = ["Checkup", "Follow-up", "Consultation", "Procedure", "Test"];
        
        // Create mock data
        for (let i = 0; i < 20; i++) {
          const now = new Date();
          const scheduledTime = addHours(now, i % 2 === 0 ? -1 * (i + 1) : i + 1);
          const sentTime = i % 2 === 0 ? addHours(scheduledTime, 0.1) : undefined;
          
          mockReminders.push({
            id: `rem-${i}`,
            patientName: `Patient ${i + 1}`,
            channel: channels[i % channels.length] as any,
            status: statuses[i % statuses.length] as any,
            scheduledTime: scheduledTime.toISOString(),
            sentTime: sentTime?.toISOString(),
            appointmentType: appointmentTypes[i % appointmentTypes.length],
            response: i % 4 === 0 ? "Will attend" : undefined,
          });
        }
        
        setReminders(mockReminders);
      } catch (error) {
        console.error("Error fetching reminders:", error);
        toast({
          title: "Error",
          description: "Failed to load reminders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReminders();
  }, [user]);
  
  // Filter reminders based on search query
  const filteredReminders = reminders.filter(reminder => 
    reminder.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reminder.appointmentType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group reminders by status
  const pendingReminders = filteredReminders.filter(r => r.status === "pending");
  const sentReminders = filteredReminders.filter(r => ["sent", "delivered", "read"].includes(r.status));
  const completedReminders = filteredReminders.filter(r => r.status === "responded");
  const failedReminders = filteredReminders.filter(r => r.status === "failed");
  
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'voice': return <Phone className="h-4 w-4" />;
      case 'app': return <BellRing className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <BellRing className="h-4 w-4" />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'sent': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read': return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      case 'responded': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'read': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'responded': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const renderRemindersList = (items: Reminder[]) => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4">
          <Skeleton className="h-16 w-full" />
        </div>
      ));
    }
    
    if (items.length === 0) {
      return (
        <div className="p-8 text-center">
          <h3 className="text-lg font-medium">No reminders found</h3>
          <p className="text-muted-foreground mt-2">
            There are no reminders in this category.
          </p>
        </div>
      );
    }
    
    return items.map(reminder => (
      <div key={reminder.id} className="p-4 border-b hover:bg-gray-50 transition-colors last:border-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${getStatusColor(reminder.status).split(' ')[0]}`}>
              {getChannelIcon(reminder.channel)}
            </div>
            <div>
              <h3 className="font-medium">{reminder.patientName}</h3>
              <div className="text-sm text-muted-foreground flex items-center">
                <span>{reminder.appointmentType}</span>
                <span className="mx-2">•</span>
                {reminder.status === "pending" ? (
                  <span>Scheduled for {format(new Date(reminder.scheduledTime), "MMM d 'at' h:mm a")}</span>
                ) : (
                  <span>
                    {reminder.sentTime 
                      ? `Sent ${format(new Date(reminder.sentTime), "MMM d 'at' h:mm a")}` 
                      : `Scheduled ${format(new Date(reminder.scheduledTime), "MMM d 'at' h:mm a")}`}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(reminder.status)}>
              <span className="flex items-center">
                {getStatusIcon(reminder.status)}
                <span className="ml-1">
                  {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                </span>
              </span>
            </Badge>
            
            <Button variant="ghost" size="sm">
              Details
            </Button>
            
            {reminder.status === "pending" && (
              <Button size="sm">
                Send Now
              </Button>
            )}
            
            {reminder.status === "failed" && (
              <Button size="sm">
                <RefreshCcw className="h-4 w-4 mr-1" /> Retry
              </Button>
            )}
          </div>
        </div>
        
        {reminder.response && (
          <div className="ml-10 mt-2 p-2 bg-gray-50 rounded-md text-sm">
            <span className="font-medium">Response:</span> {reminder.response}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reminders..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Reminder
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-amber-500" /> Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReminders.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled reminders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" /> Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentReminders.length}</div>
            <p className="text-xs text-muted-foreground">Delivered reminders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-purple-500" /> Responded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReminders.length}</div>
            <p className="text-xs text-muted-foreground">Confirmed reminders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" /> Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedReminders.length}</div>
            <p className="text-xs text-muted-foreground">Error reminders</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <Tabs defaultValue="all" className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Reminder Status</CardTitle>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="responded">Responded</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="all" className="m-0">
              <div className="divide-y">{renderRemindersList(filteredReminders)}</div>
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              <div className="divide-y">{renderRemindersList(pendingReminders)}</div>
            </TabsContent>
            <TabsContent value="sent" className="m-0">
              <div className="divide-y">{renderRemindersList(sentReminders)}</div>
            </TabsContent>
            <TabsContent value="responded" className="m-0">
              <div className="divide-y">{renderRemindersList(completedReminders)}</div>
            </TabsContent>
            <TabsContent value="failed" className="m-0">
              <div className="divide-y">{renderRemindersList(failedReminders)}</div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RemindersPage;

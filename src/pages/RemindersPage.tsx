
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
  Plus,
  Send,
  Filter
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
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock reminders
        const mockReminders: Reminder[] = [];
        const statuses = ["pending", "sent", "delivered", "read", "responded", "failed"];
        const channels = ["sms", "email", "voice", "app", "whatsapp"];
        const appointmentTypes = ["Checkup", "Follow-up", "Consultation", "Procedure", "Test"];
        
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
      case 'delivered': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'read': return <CheckCircle className="h-4 w-4 text-indigo-500" />;
      case 'responded': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'sent': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'read': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'responded': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  
  const renderRemindersList = (items: Reminder[]) => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6">
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ));
    }
    
    if (items.length === 0) {
      return (
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <BellRing className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">No reminders found</h3>
          <p className="text-slate-500 mt-2">
            There are no reminders in this category.
          </p>
        </div>
      );
    }
    
    return items.map(reminder => (
      <div key={reminder.id} className="p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-xl ${getStatusColor(reminder.status).split(' ')[0]} border`}>
              <div className="text-slate-600">
                {getChannelIcon(reminder.channel)}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-lg">{reminder.patientName}</h3>
              <div className="text-sm text-slate-600 mt-1 flex items-center flex-wrap gap-x-3 gap-y-1">
                <span className="font-medium">{reminder.appointmentType}</span>
                <span className="text-slate-400">•</span>
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
          
          <div className="flex items-center space-x-3">
            <Badge className={`${getStatusColor(reminder.status)} border font-medium px-3 py-1`}>
              <span className="flex items-center">
                {getStatusIcon(reminder.status)}
                <span className="ml-2">
                  {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                </span>
              </span>
            </Badge>
            
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
              View Details
            </Button>
            
            {reminder.status === "pending" && (
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            )}
            
            {reminder.status === "failed" && (
              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <RefreshCcw className="h-4 w-4 mr-2" /> 
                Retry
              </Button>
            )}
          </div>
        </div>
        
        {reminder.response && (
          <div className="ml-16 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
            <span className="font-medium text-emerald-800">Patient Response:</span> 
            <span className="text-emerald-700 ml-2">{reminder.response}</span>
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reminders</h1>
          <p className="text-slate-600 mt-1">Manage patient appointment reminders</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search reminders..."
              className="pl-10 w-full sm:w-64 h-11 rounded-xl border-slate-200 focus:border-blue-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white h-11 px-6 rounded-xl shadow-lg">
            <Plus className="h-4 w-4 mr-2" /> 
            New Reminder
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-amber-700">
              <Clock className="h-5 w-5 mr-2" /> 
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800">{pendingReminders.length}</div>
            <p className="text-xs text-amber-600 mt-1">Scheduled reminders</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-blue-700">
              <CheckCircle className="h-5 w-5 mr-2" /> 
              Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{sentReminders.length}</div>
            <p className="text-xs text-blue-600 mt-1">Delivered reminders</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-emerald-700">
              <CheckCircle className="h-5 w-5 mr-2" /> 
              Responded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-800">{completedReminders.length}</div>
            <p className="text-xs text-emerald-600 mt-1">Confirmed reminders</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" /> 
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800">{failedReminders.length}</div>
            <p className="text-xs text-red-600 mt-1">Error reminders</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Reminders List */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <Tabs defaultValue="all" className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-slate-800">Reminder Management</CardTitle>
                <p className="text-slate-600 text-sm mt-1">Track and manage all patient reminders</p>
              </div>
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg px-4">All</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg px-4">Pending</TabsTrigger>
                <TabsTrigger value="sent" className="rounded-lg px-4">Sent</TabsTrigger>
                <TabsTrigger value="responded" className="rounded-lg px-4">Responded</TabsTrigger>
                <TabsTrigger value="failed" className="rounded-lg px-4">Failed</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="all" className="m-0">
              <div className="divide-y divide-slate-100">{renderRemindersList(filteredReminders)}</div>
            </TabsContent>
            <TabsContent value="pending" className="m-0">
              <div className="divide-y divide-slate-100">{renderRemindersList(pendingReminders)}</div>
            </TabsContent>
            <TabsContent value="sent" className="m-0">
              <div className="divide-y divide-slate-100">{renderRemindersList(sentReminders)}</div>
            </TabsContent>
            <TabsContent value="responded" className="m-0">
              <div className="divide-y divide-slate-100">{renderRemindersList(completedReminders)}</div>
            </TabsContent>
            <TabsContent value="failed" className="m-0">
              <div className="divide-y divide-slate-100">{renderRemindersList(failedReminders)}</div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default RemindersPage;

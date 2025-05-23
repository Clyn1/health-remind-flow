
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Smartphone,
  Mail,
  Phone,
  MessageSquare,
  Bell,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Template {
  id: string;
  name: string;
  body: string;
  subject?: string;
  channel: "sms" | "email" | "voice" | "app" | "whatsapp";
  appointmentType: string | null;
  createdAt: string;
  updatedAt: string;
}

const TemplatesPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // In a real app, you'd fetch templates from Supabase here
        // For demo purposes, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTemplates: Template[] = [
          {
            id: "1",
            name: "Appointment Reminder - SMS",
            body: "Hi {{patient_name}}, this is a reminder for your {{appointment_type}} appointment with {{doctor_name}} on {{appointment_date}} at {{appointment_time}}. Reply YES to confirm or call us at (555) 123-4567 to reschedule.",
            channel: "sms",
            appointmentType: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "2",
            name: "Appointment Reminder - Email",
            subject: "Reminder: Your Upcoming Appointment",
            body: "Dear {{patient_name}},\n\nThis is a friendly reminder about your upcoming {{appointment_type}} appointment with {{doctor_name}} on {{appointment_date}} at {{appointment_time}}.\n\nLocation: {{location}}\n\nPlease arrive 15 minutes early to complete any necessary paperwork. If you need to reschedule, please call us at (555) 123-4567 at least 24 hours in advance.\n\nThank you,\nThe Medical Team",
            channel: "email",
            appointmentType: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "3",
            name: "Dental Cleaning Reminder",
            body: "Hi {{patient_name}}, don't forget your dental cleaning with Dr. {{doctor_name}} on {{appointment_date}} at {{appointment_time}}. Please brush before your appointment. Reply YES to confirm.",
            channel: "sms",
            appointmentType: "Dental Cleaning",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "4",
            name: "Physical Exam Preparation",
            subject: "Important Instructions for Your Physical Exam",
            body: "Dear {{patient_name}},\n\nYour physical examination is scheduled for {{appointment_date}} at {{appointment_time}} with Dr. {{doctor_name}}.\n\nPreparation Instructions:\n- Fast for 8 hours prior to your appointment\n- Bring all current medications\n- Wear comfortable clothing\n- Bring your insurance card\n\nIf you have any questions, please call us at (555) 123-4567.\n\nThank you,\nThe Medical Team",
            channel: "email",
            appointmentType: "Physical Exam",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "5",
            name: "MRI Appointment Preparation",
            body: "Hi {{patient_name}}, important instructions for your MRI on {{appointment_date}}: Remove all metal objects, arrive 30 min early, and inform us of any implants or devices. Reply YES to confirm.",
            channel: "sms",
            appointmentType: "MRI",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "6",
            name: "Post-Appointment Follow-up",
            subject: "Follow-up on Your Recent Appointment",
            body: "Dear {{patient_name}},\n\nThank you for visiting us on {{appointment_date}}. We hope everything went well with your {{appointment_type}} appointment with Dr. {{doctor_name}}.\n\nIf you have any questions about your treatment plan or need to schedule a follow-up, please call us at (555) 123-4567.\n\nWishing you good health,\nThe Medical Team",
            channel: "email",
            appointmentType: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "7",
            name: "WhatsApp Reminder",
            body: "Hello {{patient_name}},\nThis is a reminder for your {{appointment_type}} with Dr. {{doctor_name}} on {{appointment_date}} at {{appointment_time}}. Please reply with 'CONFIRM' to confirm your attendance or call us to reschedule.",
            channel: "whatsapp",
            appointmentType: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
        ];
        
        setTemplates(mockTemplates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Error",
          description: "Failed to load templates",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [user]);
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.appointmentType && template.appointmentType.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Group templates by channel
  const smsTemplates = filteredTemplates.filter(t => t.channel === "sms");
  const emailTemplates = filteredTemplates.filter(t => t.channel === "email");
  const whatsappTemplates = filteredTemplates.filter(t => t.channel === "whatsapp");
  const otherTemplates = filteredTemplates.filter(t => !["sms", "email", "whatsapp"].includes(t.channel));
  
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'voice': return <Phone className="h-4 w-4" />;
      case 'app': return <Bell className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };
  
  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'sms': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'email': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'voice': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'app': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'whatsapp': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const renderTemplateList = (items: Template[]) => {
    if (loading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      );
    }
    
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground mt-2">
            Create a new template to get started
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Create Template
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(template => (
          <Card key={template.id} className="overflow-hidden flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className={`mb-2 ${getChannelColor(template.channel)}`}>
                    <span className="flex items-center">
                      {getChannelIcon(template.channel)}
                      <span className="ml-1 capitalize">{template.channel}</span>
                    </span>
                  </Badge>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {template.appointmentType && (
                <CardDescription>
                  For: {template.appointmentType}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm text-muted-foreground line-clamp-4 h-20">
                {template.channel === 'email' && template.subject && (
                  <div className="font-medium mb-1">Subject: {template.subject}</div>
                )}
                {template.body}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Preview</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{template.name}</DialogTitle>
                    <DialogDescription>
                      <Badge className={getChannelColor(template.channel)}>
                        <span className="flex items-center">
                          {getChannelIcon(template.channel)}
                          <span className="ml-1 capitalize">{template.channel}</span>
                        </span>
                      </Badge>
                      {template.appointmentType && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          For: {template.appointmentType}
                        </span>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 border rounded-md p-4 max-h-96 overflow-y-auto">
                    {template.channel === 'email' && template.subject && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Subject:</div>
                        <div className="bg-gray-50 p-2 rounded">{template.subject}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium mb-1">Message:</div>
                      <div className="bg-gray-50 p-2 rounded whitespace-pre-line">{template.body}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t">
                    <div className="text-sm font-medium mb-1">Available variables:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{'{{patient_name}}'}</Badge>
                      <Badge variant="outline">{'{{doctor_name}}'}</Badge>
                      <Badge variant="outline">{'{{appointment_date}}'}</Badge>
                      <Badge variant="outline">{'{{appointment_time}}'}</Badge>
                      <Badge variant="outline">{'{{appointment_type}}'}</Badge>
                      <Badge variant="outline">{'{{location}}'}</Badge>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Message Templates</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Template
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {renderTemplateList(filteredTemplates)}
        </TabsContent>
        
        <TabsContent value="sms" className="mt-6">
          {renderTemplateList(smsTemplates)}
        </TabsContent>
        
        <TabsContent value="email" className="mt-6">
          {renderTemplateList(emailTemplates)}
        </TabsContent>
        
        <TabsContent value="whatsapp" className="mt-6">
          {renderTemplateList(whatsappTemplates)}
        </TabsContent>
        
        <TabsContent value="other" className="mt-6">
          {renderTemplateList(otherTemplates)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPage;

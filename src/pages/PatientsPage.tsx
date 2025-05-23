
import { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, Calendar, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  preferredChannels: string[];
  upcomingAppointment?: {
    date: string;
    type: string;
  };
}

const PatientsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // In a real app, you'd fetch patients from Supabase here
        // For demo purposes, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const channels = ["sms", "email", "voice", "app", "whatsapp"];
        const mockPatients: Patient[] = [];
        
        for (let i = 0; i < 20; i++) {
          // Random date in the past (18-80 years ago)
          const yearOffset = 18 + Math.floor(Math.random() * 62);
          const birthDate = new Date();
          birthDate.setFullYear(birthDate.getFullYear() - yearOffset);
          
          // Random preferences (1-3 channels)
          const numChannels = Math.floor(Math.random() * 3) + 1;
          const shuffled = [...channels].sort(() => 0.5 - Math.random());
          const selectedChannels = shuffled.slice(0, numChannels);
          
          // Random upcoming appointment (50% chance)
          const hasAppointment = Math.random() > 0.5;
          const appointmentDate = new Date();
          appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) + 1);
          const appointmentTypes = ["Checkup", "Follow-up", "Consultation", "Procedure", "Test"];
          
          mockPatients.push({
            id: `pat-${i}`,
            firstName: ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "William", "Elizabeth"][i % 10],
            lastName: ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"][i % 10],
            email: `patient${i + 1}@example.com`,
            phone: `+1 (555) ${100 + i}-${1000 + i}`,
            dateOfBirth: birthDate.toISOString(),
            preferredChannels: selectedChannels,
            upcomingAppointment: hasAppointment ? {
              date: appointmentDate.toISOString(),
              type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)]
            } : undefined
          });
        }
        
        setPatients(mockPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patients",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, [user]);
  
  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => 
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );
  
  const getChannelBadge = (channel: string) => {
    const getColor = (ch: string) => {
      switch (ch) {
        case 'sms': return 'bg-blue-100 text-blue-800';
        case 'email': return 'bg-purple-100 text-purple-800';
        case 'voice': return 'bg-amber-100 text-amber-800';
        case 'app': return 'bg-indigo-100 text-indigo-800';
        case 'whatsapp': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <Badge className={`${getColor(channel)} mr-1`} variant="outline">
        {channel}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Patient
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="table" className="w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <span className="text-sm font-medium mr-2">
                  {filteredPatients.length} patients
                </span>
              </div>
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="card">Card View</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="table" className="m-0">
              <div className="border-b">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Preferences</TableHead>
                      <TableHead>Next Appointment</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5}>
                            <Skeleton className="h-12 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map(patient => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">
                            <div>{patient.firstName} {patient.lastName}</div>
                            {patient.dateOfBirth && (
                              <div className="text-xs text-muted-foreground">
                                DOB: {format(new Date(patient.dateOfBirth), "MMM d, yyyy")}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{patient.email}</div>
                            <div className="text-sm">{patient.phone}</div>
                          </TableCell>
                          <TableCell>
                            {patient.preferredChannels.map(channel => (
                              getChannelBadge(channel)
                            ))}
                          </TableCell>
                          <TableCell>
                            {patient.upcomingAppointment ? (
                              <div>
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(patient.upcomingAppointment.date), "MMM d, yyyy")}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(patient.upcomingAppointment.date), "h:mm a")} - {patient.upcomingAppointment.type}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">None scheduled</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" /> Schedule Appointment
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="h-4 w-4 mr-2" /> Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="card" className="m-0">
              {loading ? (
                <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium">No patients found</h3>
                </div>
              ) : (
                <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPatients.map(patient => (
                    <Card key={patient.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{patient.firstName} {patient.lastName}</h3>
                            {patient.dateOfBirth && (
                              <div className="text-xs text-muted-foreground mb-2">
                                DOB: {format(new Date(patient.dateOfBirth), "MMM d, yyyy")}
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" /> Schedule Appointment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Bell className="h-4 w-4 mr-2" /> Send Reminder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <div className="flex items-start">
                            <div className="w-20 text-xs text-muted-foreground">Email:</div>
                            <div className="text-sm">{patient.email}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-20 text-xs text-muted-foreground">Phone:</div>
                            <div className="text-sm">{patient.phone}</div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-20 text-xs text-muted-foreground">Preferences:</div>
                            <div className="flex flex-wrap">
                              {patient.preferredChannels.map(channel => (
                                getChannelBadge(channel)
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t">
                          <div className="text-xs text-muted-foreground mb-1">Next Appointment:</div>
                          {patient.upcomingAppointment ? (
                            <div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(new Date(patient.upcomingAppointment.date), "MMM d, yyyy")}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(patient.upcomingAppointment.date), "h:mm a")} - {patient.upcomingAppointment.type}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">None scheduled</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientsPage;


import { useState, useEffect } from "react";
import { CalendarIcon, PlusIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
}

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"list" | "calendar">("list");
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // In a real app, you'd fetch appointments from Supabase here
        // For demo purposes, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock appointments for the next 5 days
        const mockAppointments: Appointment[] = [];
        const statuses = ["scheduled", "confirmed", "cancelled", "completed", "no_show"];
        const types = ["Checkup", "Follow-up", "Consultation", "Procedure", "Test"];
        
        // Generate 15 mock appointments
        for (let i = 0; i < 15; i++) {
          const appointmentDate = new Date();
          appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 7));
          appointmentDate.setHours(9 + Math.floor(Math.random() * 8));
          appointmentDate.setMinutes(Math.random() > 0.5 ? 0 : 30);
          
          const endTime = new Date(appointmentDate);
          endTime.setMinutes(endTime.getMinutes() + 30);
          
          mockAppointments.push({
            id: `app-${i}`,
            patientName: `Patient ${i + 1}`,
            doctorName: `Dr. ${["Smith", "Johnson", "Williams", "Jones", "Brown"][i % 5]}`,
            startTime: appointmentDate.toISOString(),
            endTime: endTime.toISOString(),
            type: types[i % types.length],
            status: statuses[i % statuses.length],
          });
        }
        
        setAppointments(mockAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user]);
  
  // Filter appointments based on selected date
  const filteredAppointments = appointments.filter(app => {
    const appDate = new Date(app.startTime);
    return (
      appDate.getFullYear() === selectedDate.getFullYear() &&
      appDate.getMonth() === selectedDate.getMonth() &&
      appDate.getDate() === selectedDate.getDate()
    );
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'no_show': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(selectedDate, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Tabs defaultValue="list" onValueChange={(value) => setView(value as "list" | "calendar")}>
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        {view === "list" ? (
          <div className="divide-y">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4">
                  <Skeleton className="h-14 w-full" />
                </div>
              ))
            ) : filteredAppointments.length === 0 ? (
              // No appointments message
              <div className="p-8 text-center">
                <h3 className="text-lg font-medium">No appointments found</h3>
                <p className="text-muted-foreground mt-2">
                  There are no appointments scheduled for this date.
                </p>
              </div>
            ) : (
              // Appointment list
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.patientName}</h3>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(appointment.startTime), "h:mm a")} - {format(new Date(appointment.endTime), "h:mm a")}
                        <span className="mx-2">•</span>
                        {appointment.doctorName}
                        <span className="mx-2">•</span>
                        {appointment.type}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Calendar view (simplified version)
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Simplified calendar display - in a real app you'd implement a full calendar */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - selectedDate.getDay() + 1);
                const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();
                
                // Find appointments for this day
                const dayAppointments = appointments.filter(app => {
                  const appDate = new Date(app.startTime);
                  return appDate.toDateString() === day.toDateString();
                });
                
                return (
                  <div
                    key={i}
                    className={`h-24 border p-1 ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                    } ${isToday ? "border-blue-500" : ""} ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="text-right mb-1">
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((app, idx) => (
                        <div
                          key={idx}
                          className={`text-xs rounded px-1 py-0.5 truncate ${
                            getStatusColor(app.status)
                          }`}
                        >
                          {format(new Date(app.startTime), "h:mm")} {app.patientName}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;

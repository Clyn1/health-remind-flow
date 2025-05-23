
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingReminders: number;
  completedAppointments: number;
}

interface AppointmentData {
  date: string;
  scheduled: number;
  confirmed: number;
  completed: number;
  noShow: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    confirmedAppointments: 0,
    pendingReminders: 0,
    completedAppointments: 0,
  });
  const [appointmentData, setAppointmentData] = useState<AppointmentData[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // This is a simplified version - in a real app, you'd fetch actual data from Supabase
        // For demo purposes, we're using mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stats
        setStats({
          totalAppointments: 124,
          confirmedAppointments: 89,
          pendingReminders: 35,
          completedAppointments: 76,
        });
        
        // Mock chart data for the last 7 days
        const mockChartData = Array.from({ length: 7 }).map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index));
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          return {
            date: formattedDate,
            scheduled: Math.floor(Math.random() * 20) + 10,
            confirmed: Math.floor(Math.random() * 15) + 5,
            completed: Math.floor(Math.random() * 12) + 3,
            noShow: Math.floor(Math.random() * 5),
          };
        });
        
        setAppointmentData(mockChartData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Appointments" 
          value={stats.totalAppointments.toString()} 
          description="Last 30 days" 
          loading={loading} 
        />
        <StatsCard 
          title="Confirmed Appointments" 
          value={stats.confirmedAppointments.toString()} 
          description="Last 30 days" 
          loading={loading} 
        />
        <StatsCard 
          title="Pending Reminders" 
          value={stats.pendingReminders.toString()} 
          description="To be sent" 
          loading={loading} 
        />
        <StatsCard 
          title="Completed Appointments" 
          value={stats.completedAppointments.toString()} 
          description="Last 30 days" 
          loading={loading} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Last 7 days overview</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scheduled" fill="#4338ca" />
                  <Bar dataKey="confirmed" fill="#10b981" />
                  <Bar dataKey="noShow" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reminder Performance</CardTitle>
            <CardDescription>Delivery and response rates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="scheduled" stroke="#4338ca" />
                  <Line type="monotone" dataKey="confirmed" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest reminders and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reminders">
            <TabsList>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value="reminders" className="pt-4">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <ActivityItem 
                    title="Appointment reminder sent" 
                    description="SMS to James Wilson for Cardiology appointment" 
                    time="30 minutes ago" 
                    status="sent" 
                  />
                  <ActivityItem 
                    title="Appointment confirmation" 
                    description="Sarah Johnson confirmed her Dental checkup" 
                    time="2 hours ago" 
                    status="confirmed" 
                  />
                  <ActivityItem 
                    title="Appointment reminder failed" 
                    description="Email to Mike Peters bounced" 
                    time="5 hours ago" 
                    status="failed" 
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="appointments" className="pt-4">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <ActivityItem 
                    title="Pediatric checkup" 
                    description="Dr. Emma Lewis with Emma Thompson" 
                    time="Tomorrow at 10:00 AM" 
                    status="scheduled" 
                  />
                  <ActivityItem 
                    title="Annual physical" 
                    description="Dr. John Smith with Robert Davis" 
                    time="Today at 2:30 PM" 
                    status="completed" 
                  />
                  <ActivityItem 
                    title="Dermatology consultation" 
                    description="Dr. Sarah Adams with Chris Moore" 
                    time="Yesterday at 11:15 AM" 
                    status="no_show" 
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const StatsCard = ({ 
  title, 
  value, 
  description, 
  loading 
}: { 
  title: string; 
  value: string; 
  description: string; 
  loading: boolean; 
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ 
  title, 
  description, 
  time, 
  status 
}: { 
  title: string; 
  description: string; 
  time: string; 
  status: string; 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'no_show':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </span>
        <span className="text-xs text-muted-foreground mt-1">{time}</span>
      </div>
    </div>
  );
};

export default Dashboard;

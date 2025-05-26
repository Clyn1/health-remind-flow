
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CalendarDays, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Activity,
  Heart
} from "lucide-react";

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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-blue-100 mt-2">Here's what's happening with your patients today</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <Heart className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Appointments" 
          value={stats.totalAppointments.toString()} 
          description="Last 30 days" 
          loading={loading}
          icon={<CalendarDays className="h-5 w-5" />}
          gradient="from-blue-500 to-blue-600"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatsCard 
          title="Confirmed Appointments" 
          value={stats.confirmedAppointments.toString()} 
          description="Ready to go" 
          loading={loading}
          icon={<CheckCircle2 className="h-5 w-5" />}
          gradient="from-emerald-500 to-emerald-600"
          bgColor="bg-emerald-50"
          textColor="text-emerald-600"
        />
        <StatsCard 
          title="Pending Reminders" 
          value={stats.pendingReminders.toString()} 
          description="To be sent" 
          loading={loading}
          icon={<Clock className="h-5 w-5" />}
          gradient="from-amber-500 to-orange-500"
          bgColor="bg-amber-50"
          textColor="text-amber-600"
        />
        <StatsCard 
          title="Active Patients" 
          value={stats.completedAppointments.toString()} 
          description="This month" 
          loading={loading}
          icon={<Users className="h-5 w-5" />}
          gradient="from-purple-500 to-purple-600"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>Last 7 days overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full rounded-xl" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Bar dataKey="scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="confirmed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="noShow" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle>Reminder Performance</CardTitle>
                <CardDescription>Delivery and response rates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full rounded-xl" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="confirmed" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest reminders and appointments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reminders">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="reminders" className="rounded-lg">Reminders</TabsTrigger>
              <TabsTrigger value="appointments" className="rounded-lg">Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value="reminders" className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
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
            <TabsContent value="appointments" className="pt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
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
  loading,
  icon,
  gradient,
  bgColor,
  textColor
}: { 
  title: string; 
  value: string; 
  description: string; 
  loading: boolean;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
  textColor: string;
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className={`p-3 ${bgColor} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                <div className={textColor}>
                  {icon}
                </div>
              </div>
              <div className={`h-12 w-1 bg-gradient-to-b ${gradient} rounded-full`}></div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-slate-800">{value}</div>
              <div className="text-sm text-slate-600 mt-1">{title}</div>
              <p className="text-xs text-slate-500 mt-2">{description}</p>
            </div>
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
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'sent':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'confirmed':
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'failed':
      case 'no_show':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
      <div className="flex flex-col">
        <div className="font-medium text-slate-800">{title}</div>
        <div className="text-sm text-slate-600 mt-1">{description}</div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </span>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
    </div>
  );
};

export default Dashboard;

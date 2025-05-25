
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  BellRing, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import StatusBadge from "@/components/ui/status-badge";

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

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status: string;
  type: 'reminder' | 'appointment';
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
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock stats with trends
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

        // Mock recent activity
        const mockActivity: ActivityItem[] = [
          {
            id: '1',
            title: 'Appointment confirmed',
            description: 'Sarah Johnson confirmed her dental checkup',
            time: '10 minutes ago',
            status: 'confirmed',
            type: 'appointment'
          },
          {
            id: '2', 
            title: 'Reminder sent',
            description: 'SMS reminder sent to James Wilson',
            time: '25 minutes ago',
            status: 'sent',
            type: 'reminder'
          },
          {
            id: '3',
            title: 'Appointment completed',
            description: 'Dr. Smith completed consultation with Mike Peters',
            time: '1 hour ago',
            status: 'completed',
            type: 'appointment'
          },
          {
            id: '4',
            title: 'Reminder failed',
            description: 'Email delivery failed for Emma Thompson',
            time: '2 hours ago',
            status: 'failed',
            type: 'reminder'
          }
        ];
        
        setRecentActivity(mockActivity);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const pieData = [
    { name: 'Confirmed', value: stats.confirmedAppointments, color: '#3b82f6' },
    { name: 'Completed', value: stats.completedAppointments, color: '#10b981' },
    { name: 'Pending', value: stats.pendingReminders, color: '#f59e0b' },
  ];
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Good morning, Dr. Admin! 👋</h1>
            <p className="text-blue-100 text-lg">
              You have {stats.totalAppointments} appointments today and {stats.pendingReminders} pending reminders.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Appointments" 
          value={stats.totalAppointments.toString()} 
          description="This month" 
          icon={CalendarDays}
          loading={loading} 
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatsCard 
          title="Confirmed" 
          value={stats.confirmedAppointments.toString()} 
          description="Response rate: 89%" 
          icon={CheckCircle}
          loading={loading} 
          trend={{ value: 5, isPositive: true }}
          color="green"
        />
        <StatsCard 
          title="Pending Reminders" 
          value={stats.pendingReminders.toString()} 
          description="To be sent today" 
          icon={Clock}
          loading={loading}
          color="orange"
        />
        <StatsCard 
          title="Completed" 
          value={stats.completedAppointments.toString()} 
          description="Successfully finished" 
          icon={Users}
          loading={loading} 
          trend={{ value: 8, isPositive: true }}
          color="purple"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <BarChart className="h-5 w-5 text-blue-600" />
              Appointment Trends
            </CardTitle>
            <CardDescription>Weekly appointment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="confirmed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Communication Overview
            </CardTitle>
            <CardDescription>Reminder delivery statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full h-[300px] bg-gray-100 rounded-lg animate-pulse" />
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BellRing className="h-5 w-5 text-purple-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest system events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Activity</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.type === 'reminder' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {item.type === 'reminder' ? <BellRing className="h-5 w-5" /> : <CalendarDays className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="reminders" className="space-y-4">
              {recentActivity.filter(item => item.type === 'reminder').map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              {recentActivity.filter(item => item.type === 'appointment').map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;


import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { 
  CalendarDays, 
  BellRing, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  TestTube,
  Stethoscope,
  Activity
} from "lucide-react";
import LoginForm from "./auth/LoginForm";

const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const navItems = [
    { path: "/", icon: <LayoutDashboard className="mr-3 h-5 w-5" />, label: "Dashboard" },
    { path: "/appointments", icon: <CalendarDays className="mr-3 h-5 w-5" />, label: "Appointments" },
    { path: "/reminders", icon: <BellRing className="mr-3 h-5 w-5" />, label: "Reminders" },
    { path: "/templates", icon: <FileText className="mr-3 h-5 w-5" />, label: "Templates" },
    { path: "/patients", icon: <Users className="mr-3 h-5 w-5" />, label: "Patients" },
    { path: "/test-messaging", icon: <TestTube className="mr-3 h-5 w-5" />, label: "Test Messaging" },
    { path: "/settings", icon: <Settings className="mr-3 h-5 w-5" />, label: "Settings" },
  ];
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white/90 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                       fixed lg:relative inset-y-0 left-0 z-40 w-72 transition duration-300 ease-in-out 
                       transform bg-white/95 backdrop-blur-sm border-r border-blue-100 lg:translate-x-0 shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 pt-8 pb-6 border-b border-blue-100/50">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-3">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">HealthRemind</h1>
                <p className="text-sm text-blue-600 font-medium">Pro Care System</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-lg">
              <Activity className="h-3 w-3 mr-2 text-green-500" />
              <span>System Active</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 ${
                  location.pathname === item.path 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25" 
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Profile & Logout */}
          <div className="p-4 border-t border-blue-100/50">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-3">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Dr. Admin</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex w-full items-center justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100/50 py-4 px-6 sticky top-0 z-30">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {navItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-blue-100">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Online</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

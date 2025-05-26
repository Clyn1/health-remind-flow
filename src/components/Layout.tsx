
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
  Stethoscope
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white shadow-lg border-blue-200 hover:bg-blue-50"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                       fixed lg:relative inset-y-0 left-0 z-40 w-72 transition-all duration-300 ease-in-out 
                       transform bg-white shadow-2xl border-r border-blue-100 lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HealthRemind</h1>
                <p className="text-blue-100 text-sm">Follow-Up Reminder System</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path 
                    ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg transform scale-105" 
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1"
                }`}
              >
                <div className={`${location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-blue-600"}`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-xl shadow-sm mb-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                <p className="text-xs text-slate-500">Healthcare Professional</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex w-full items-center justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
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
        <header className="bg-white shadow-sm border-b border-slate-200 py-4 px-6 backdrop-blur-sm bg-white/95">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {navItems.find(item => item.path === location.pathname)?.label || "Not Found"}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Manage your healthcare reminders and appointments
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-slate-600">System Online</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

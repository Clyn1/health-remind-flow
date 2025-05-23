
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
  LayoutDashboard
} from "lucide-react";
import LoginForm from "./auth/LoginForm";

const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const navItems = [
    { path: "/", icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: "Dashboard" },
    { path: "/appointments", icon: <CalendarDays className="mr-2 h-4 w-4" />, label: "Appointments" },
    { path: "/reminders", icon: <BellRing className="mr-2 h-4 w-4" />, label: "Reminders" },
    { path: "/templates", icon: <FileText className="mr-2 h-4 w-4" />, label: "Templates" },
    { path: "/patients", icon: <Users className="mr-2 h-4 w-4" />, label: "Patients" },
    { path: "/settings", icon: <Settings className="mr-2 h-4 w-4" />, label: "Settings" },
  ];
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                       fixed lg:relative inset-y-0 left-0 z-40 w-64 transition duration-300 ease-in-out 
                       transform bg-white border-r border-gray-200 lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="px-6 pt-8 pb-6">
            <h1 className="text-xl font-bold text-blue-600">HealthRemind</h1>
            <p className="text-sm text-gray-500">Follow-Up Reminder System</p>
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${
                  location.pathname === item.path 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-700"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex w-full items-center justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Top header */}
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {navItems.find(item => item.path === location.pathname)?.label || "Not Found"}
            </h2>
            <div className="flex items-center gap-4">
              {/* User profile info would go here */}
              <span className="text-sm font-medium">{user?.email}</span>
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

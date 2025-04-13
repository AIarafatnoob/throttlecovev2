import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get maintenance reminders
  const { data: reminders = [] } = useQuery<any[]>({
    queryKey: ['/api/motorcycles/maintenance-reminders'],
    enabled: !!user,
  });
  
  const notificationCount = reminders.length;

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      queryClient.invalidateQueries({ queryKey: ['/api/auth/session'] });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navLinks = [
    { name: "Garage", path: "/garage" },
    { name: "Maintenance", path: "/maintenance" },
    { name: "Community", path: "/community" },
    { name: "Catalog", path: "/catalog" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-header tracking-wider">
          THROTTLE<span className="text-[#FF3B30]">COVE</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`hover:text-[#FF3B30] transition-all py-2 ${
                  location === link.path ? "text-[#FF3B30]" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <Button variant="ghost" className="hover:text-[#FF3B30] transition-all p-1">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="bg-[#FF3B30] rounded-full px-1.5 text-xs absolute -top-1 -right-1">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="hidden md:inline">{user.fullName.split(' ')[0]} {user.fullName.split(' ')[1]?.charAt(0)}.</span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white text-black">
                      <div className="flex items-center justify-start p-2 border-b mb-1">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-xs text-gray-500">@{user.username}</span>
                        </div>
                      </div>
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-[#FF3B30]">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#FF3B30] hover:bg-opacity-90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-gray-800 px-4 py-2">
          <div className="flex flex-col space-y-2 py-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`py-2 block ${
                  location === link.path ? "text-[#FF3B30]" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <>
                <Link 
                  href="/login" 
                  className="py-2 block" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="py-2 block text-[#FF3B30]" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <Button
                variant="ghost"
                className="justify-start px-0 text-white hover:text-[#FF3B30]"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

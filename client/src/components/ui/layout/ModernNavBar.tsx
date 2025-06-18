import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const ModernNavBar = () => {
  const [location] = useLocation();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
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
    { name: "Community", path: "/community" },
    { name: "Catalog", path: "/catalog" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center relative">
          <div className="flex items-center bg-[#1A1A1A] rounded-full px-8 py-3 shadow-lg max-w-fit">
            <Link href="/" className="flex items-center gap-3 mr-6">
              <div className="w-8 h-8 bg-[#FF3B30] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">
                ThrottleCove
              </span>
            </Link>
            
            <div className="flex items-center space-x-1">
              {navLinks.filter(link => link.name !== 'Admin').map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                    location === link.path
                      ? "bg-[#FF3B30] text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="rounded-full border-gray-300 text-gray-600 hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30]"
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full text-gray-600 hover:text-[#FF3B30]">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* User garage text below navbar */}
        {user && (
          <div className="text-center py-2 border-t border-gray-100">
            <span className="text-sm text-gray-600">{user.fullName || user.username}'s Garage</span>
          </div>
        )}
      </div>
      
      
    </nav>
  );
};

export default ModernNavBar;
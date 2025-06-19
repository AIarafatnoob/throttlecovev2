import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, LogOut } from "lucide-react";

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center min-h-[60px] w-full gap-2">
          <div className="flex items-center bg-[#1A1A1A] rounded-full px-3 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg flex-1 max-w-none sm:max-w-fit sm:mx-auto justify-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 mr-3 sm:mr-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#FF3B30] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-5 sm:h-5 text-white fill-current">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span className="text-base sm:text-lg font-semibold text-white hidden sm:block">
                Throttle<span className="text-[#FF3B30] font-bold">Cove</span>
              </span>
            </Link>

            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {navLinks.filter(link => link.name !== 'Admin').map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs sm:text-sm font-medium px-1.5 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
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

          <div className="flex-shrink-0 relative">
            {user ? (
              <div className="group relative">
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="rounded-full bg-[#1A1A1A] hover:bg-[#FF3B30] text-white text-xs sm:text-sm transition-all duration-300 ease-in-out transform group-hover:px-4 px-2 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  <LogOut className="h-4 w-4 group-hover:opacity-0 transition-opacity duration-300" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    LOGOUT
                  </span>
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Link href="/register">
                  <div className="group relative">
                    <Button 
                      size="sm" 
                      className="rounded-full bg-[#1A1A1A] hover:bg-[#FF3B30] text-white text-xs sm:text-sm transition-all duration-300 ease-in-out transform group-hover:px-4 px-2 shadow-lg hover:shadow-xl relative overflow-hidden"
                    >
                      <ArrowRight className="h-4 w-4 group-hover:opacity-0 transition-opacity duration-300" />
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        JOIN
                      </span>
                    </Button>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>


    </nav>
  );
};

export default ModernNavBar;
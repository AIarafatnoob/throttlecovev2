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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-center relative min-h-[60px] items-center">
          <div className="flex items-center bg-[#1A1A1A] rounded-full px-3 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg max-w-fit">
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
                  className={`text-xs sm:text-sm font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
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

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="rounded-full border-gray-300 text-gray-600 hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30] text-xs sm:text-sm px-2 sm:px-4"
              >
                Logout
              </Button>
            ) : (
              <Link href="/register">
                <Button size="sm" className="rounded-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap">
                  Join Now
                </Button>
              </Link>
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
import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

export default function ModernNavBar() {
  const [location] = useLocation();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", undefined);
      setUser(null);
      queryClient.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-center items-center min-h-[60px] w-full">
          <div className="navbar-container flex items-center bg-[#1A1A1A] px-4 sm:px-6 lg:px-8 py-3 shadow-lg mx-auto justify-center max-w-4xl" style={{ borderRadius: '9999px' }}>
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

            <div className="flex items-center space-x-2 ml-4">
              {user ? (
                <Button
                  onClick={handleLogout}
                  size="sm"
                  className="rounded-full bg-white/10 hover:bg-[#FF3B30] text-white text-xs sm:text-sm transition-all duration-300 px-4 py-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="rounded-full text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 px-3 py-2"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      size="sm"
                      className="rounded-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white text-xs sm:text-sm transition-all duration-300 px-4 py-2"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
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
}
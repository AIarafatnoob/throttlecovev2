import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, LogOut } from "lucide-react";
import logo from "@/assets/tclogov2r2.svg"

const ModernNavBar = () => {
  const { user, clearUser } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { setUser } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    const setIsLoading = useState(false)[1];
    setIsLoading(true);
    try {
      // If this is a dev user, just clear locally
      if (user?.id === "dev-001") {
        clearUser();
        window.location.href = "/";
        return;
      }

      await apiRequest("POST", "/api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <nav className={`bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center min-h-[60px] w-full gap-2">
          <div className="flex items-center bg-[#1A1A1A] rounded-full px-3 sm:px-6 lg:px-8 py-2 sm:py-3 shadow-lg mx-auto min-w-fit max-w-fit justify-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 mr-3 sm:mr-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={logo}
                    alt="ThrottleCove Logo"
                    className="object-contain w-full h-full"
                  />
              </div>
              <span className="text-base sm:text-lg font-semibold text-white hidden sm:block">
                THROTTLE<span className="text-[#FF3B30] font-bold">Cove</span>
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

      {/* Sticky nav pill that follows scroll */}

    </nav>
  );
};

export default ModernNavBar;
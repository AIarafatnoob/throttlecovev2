import { Switch, Route } from "wouter";
import NavBar from "@/components/ui/layout/ModernNavBar";
import Footer from "@/components/ui/layout/Footer";
import Home from "@/pages/Home";
import Garage from "@/pages/NewGarage";
import Maintenance from "@/pages/Maintenance";
import Community from "@/pages/Community";
import Catalog from "@/pages/Catalog";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import MaintenanceScheduler from "@/pages/MaintenanceScheduler";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DocumentUpload from "@/pages/DocumentUpload";
import DocumentViewer from "@/pages/DocumentViewer";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const { user, setUser } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/auth/session'],
    retry: false,
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);
  
  // Use the AuthenticatedRoute component to protect routes
  const AuthenticatedRoute = ({ component: Component, ...rest }: any) => {
    if (isLoading) {
      // Show loading state
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }
    
    if (!user) {
      // Redirect to login if not authenticated
      return <Login />;
    }
    
    return <Component {...rest} />;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/garage">
            <AuthenticatedRoute component={Garage} />
          </Route>

          <Route path="/community">
            <AuthenticatedRoute component={Community} />
          </Route>
          <Route path="/catalog" component={Catalog} />
          <Route path="/shop" component={Shop} />
          <Route path="/blog" component={Blog} />
          <Route path="/maintenance">
            <AuthenticatedRoute component={MaintenanceScheduler} />
          </Route>
          <Route path="/documents/upload">
            <AuthenticatedRoute component={DocumentUpload} />
          </Route>
          <Route path="/documents/view/:type">
            <AuthenticatedRoute component={DocumentViewer} />
          </Route>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;

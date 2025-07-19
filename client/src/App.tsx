import { Switch, Route } from "wouter";
import NavBar from "@/components/ui/layout/ModernNavBar";
import Footer from "@/components/ui/layout/Footer";
import Home from "@/pages/Home";
import Garage from "@/pages/NewGarage";
import Maintenance from "@/pages/Maintenance";
import Squad from "@/pages/Squad";
import Catalog from "@/pages/Catalog";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import MaintenanceScheduler from "@/pages/MaintenanceScheduler";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DocumentUpload from "@/pages/DocumentUpload";
import DocumentViewer from "@/pages/DocumentViewer";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Use the AuthenticatedRoute component to protect routes
  const AuthenticatedRoute = ({ component: Component, ...rest }: any) => {
    if (isLoading) {
      // Show loading state while checking authentication
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
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
          <Route path="/community" component={Squad} />
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
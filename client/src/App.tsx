import { Switch, Route } from "wouter";
import NavBar from "@/components/ui/layout/ModernNavBar";
import Footer from "@/components/ui/layout/Footer";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Garage from "@/pages/NewGarage";
import Community from "@/pages/Community";
import Catalog from "@/pages/Catalog";
import Shop from "@/pages/Shop";
import Blog from "@/pages/Blog";
import MaintenanceScheduler from "@/pages/MaintenanceScheduler";
import DocumentUpload from "@/pages/DocumentUpload";
import DocumentViewer from "@/pages/DocumentViewer";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && <NavBar />}
      <main className="flex-grow">
        <Switch>
          {isLoading || !isAuthenticated ? (
            <Route path="/" component={Landing} />
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/garage" component={Garage} />
              <Route path="/community" component={Community} />
              <Route path="/maintenance" component={MaintenanceScheduler} />
              <Route path="/documents/upload" component={DocumentUpload} />
              <Route path="/documents/view/:type" component={DocumentViewer} />
            </>
          )}
          <Route path="/catalog" component={Catalog} />
          <Route path="/shop" component={Shop} />
          <Route path="/blog" component={Blog} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
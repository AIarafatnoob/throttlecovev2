import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Motorcycle } from "@shared/schema";
import MotorcycleCard from "@/components/ui/motorcycle/MotorcycleCard";
import AddMotorcycleDialog from "@/components/ui/motorcycle/AddMotorcycleDialog";
import { Grid, List, Plus, Bike, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Garage = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: motorcycles, isLoading, error } = useQuery<Motorcycle[]>({
    queryKey: ['/api/motorcycles'],
  });
  
  const handleAddMotorcycle = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleEditMotorcycle = (motorcycle: Motorcycle) => {
    toast({
      title: "Coming Soon",
      description: "Motorcycle editing feature will be available soon!",
    });
  };
  
  const handleDeleteMotorcycle = async () => {
    if (!motorcycleToDelete) return;
    
    try {
      await apiRequest("DELETE", `/api/motorcycles/${motorcycleToDelete}`, undefined);
      
      queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
      
      toast({
        title: "Motorcycle Deleted",
        description: "The motorcycle has been removed from your garage.",
      });
      
      setMotorcycleToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete motorcycle. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-header text-[#1A1A1A]">Your Garage</h2>
          <p className="text-gray-600">Manage your motorcycle collection</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="flex border rounded overflow-hidden">
            <Button
              variant={isGridView ? "default" : "ghost"}
              className={`rounded-none px-4 py-2 ${
                isGridView ? "bg-[#007AFF]" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setIsGridView(true)}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={!isGridView ? "default" : "ghost"}
              className={`rounded-none px-4 py-2 ${
                !isGridView ? "bg-[#007AFF]" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setIsGridView(false)}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          <Button 
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
            onClick={handleAddMotorcycle}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Motorcycle
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-[#007AFF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center h-64">
          <AlertTriangle className="h-12 w-12 text-[#FF3B30] mb-4" />
          <h3 className="text-xl font-bold">Error Loading Motorcycles</h3>
          <p className="text-gray-600">Unable to load your garage. Please try again later.</p>
        </div>
      )}
      
      {!isLoading && !error && motorcycles && motorcycles.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300">
          <Bike className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold">Your Garage is Empty</h3>
          <p className="text-gray-600 mb-6">Add your first motorcycle to get started</p>
          <Button 
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
            onClick={handleAddMotorcycle}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Motorcycle
          </Button>
        </div>
      )}
      
      {!isLoading && !error && motorcycles && motorcycles.length > 0 && (
        <div className={`grid ${
          isGridView 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        } gap-6`}>
          {motorcycles.map((motorcycle) => (
            <MotorcycleCard 
              key={motorcycle.id} 
              motorcycle={motorcycle} 
              onUpdate={() => handleEditMotorcycle(motorcycle)}
              onDelete={(id) => setMotorcycleToDelete(id)}
            />
          ))}
          
          {/* Add motorcycle card */}
          <div 
            className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 h-full min-h-[200px] cursor-pointer hover:bg-gray-50 transition-all"
            onClick={handleAddMotorcycle}
          >
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold font-header text-center">Add Motorcycle</h3>
            <p className="text-gray-500 text-center mt-2">Click to add a new motorcycle to your garage</p>
          </div>
        </div>
      )}
      
      <AddMotorcycleDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] })}
      />
      
      <AlertDialog open={!!motorcycleToDelete} onOpenChange={() => setMotorcycleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this motorcycle and all associated maintenance records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
              onClick={handleDeleteMotorcycle}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Garage;

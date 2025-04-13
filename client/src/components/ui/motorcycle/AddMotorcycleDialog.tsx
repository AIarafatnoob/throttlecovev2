import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { insertMotorcycleSchema } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";

interface AddMotorcycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Extend the schema to handle string input for tags
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  engineSize: z.string().min(1, "Engine size is required"),
  mileage: z.number().int().min(0),
  imageUrl: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  tags: z.string().transform((val) => val.split(',').map(t => t.trim()).filter(Boolean)),
});

type FormValues = z.infer<typeof formSchema>;

const AddMotorcycleDialog = ({ open, onOpenChange, onSuccess }: AddMotorcycleDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      engineSize: "",
      mileage: 0,
      imageUrl: "",
      status: "active",
      tags: "Motorcycle",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Log the data being sent to check values
      console.log("Submitting motorcycle:", data);
      
      // Make sure tags is an array before sending
      const formattedData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : [data.tags],
      };
      
      await apiRequest("POST", "/api/motorcycles", formattedData);
      
      toast({
        title: "Success",
        description: "Motorcycle added to your garage!",
      });
      
      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding motorcycle:", error);
      toast({
        title: "Error",
        description: "Failed to add motorcycle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-header">Add Motorcycle</DialogTitle>
          <Button 
            className="absolute right-4 top-4" 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="My Bike" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...field}
                      >
                        <option value="active">Active</option>
                        <option value="in service">In Service</option>
                        <option value="stored">Stored</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Ducati" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Monster" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2023" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="engineSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Size</FormLabel>
                    <FormControl>
                      <Input placeholder="821cc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Sport, Italian, Naked" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Motorcycle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMotorcycleDialog;

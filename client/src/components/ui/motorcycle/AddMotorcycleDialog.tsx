import { useState, useRef } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Upload, Camera, FileText } from "lucide-react";
import { insertMotorcycleSchema } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";

interface AddMotorcycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Motorcycle nickname is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  engineSize: z.string().min(1, "Engine size is required"),
  mileage: z.number().int().min(0),
  imageUrl: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  tags: z.array(z.string()).default(["Motorcycle"]),
});

type FormValues = z.infer<typeof formSchema>;

const AddMotorcycleDialog = ({ open, onOpenChange, onSuccess }: AddMotorcycleDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentsInputRef = useRef<HTMLInputElement>(null);
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
      tags: ["Motorcycle"],
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setUploadedPhoto(imageUrl);
      form.setValue("imageUrl", imageUrl);
    }
  };

  const handleDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedDocuments(prev => [...prev, ...files]);
      toast({
        title: "Documents uploaded",
        description: `${files.length} document(s) added for this vehicle.`,
      });
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        imageUrl: uploadedPhoto || "",
        tags: data.tags || ["Motorcycle"]
      };
      
      await apiRequest("POST", "/api/motorcycles", formattedData);
      
      toast({
        title: "Success",
        description: "Motorcycle added to your garage!",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/motorcycles'] });
      
      form.reset();
      setUploadedPhoto(null);
      setUploadedDocuments([]);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1A1A1A]">Add New Motorcycle</DialogTitle>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Vehicle Photo</Label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#FF3B30] transition-colors"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {uploadedPhoto ? (
                      <div className="space-y-2">
                        <img src={uploadedPhoto} alt="Uploaded" className="w-20 h-20 object-cover rounded-lg mx-auto" />
                        <p className="text-sm text-gray-600">Photo uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload photo</p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Nickname *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., My Beast" 
                        className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                        {...field} 
                      />
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
                    <FormLabel className="text-sm font-medium">Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="in service">In Service</SelectItem>
                        <SelectItem value="stored">Stored</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Vehicle Details */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Make *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Honda, Yamaha" 
                        className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                        {...field} 
                      />
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
                    <FormLabel className="text-sm font-medium">Model *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., CBR600RR" 
                        className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Year *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2023" 
                        className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]"
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
                    <FormLabel className="text-sm font-medium">Engine *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="600cc" 
                        className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Mileage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vehicle Documents */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Vehicle Documents (Optional)</Label>
              <div className="border border-gray-300 rounded-lg p-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-[#FF3B30] transition-colors"
                  onClick={() => documentsInputRef.current?.click()}
                >
                  <FileText className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload vehicle-specific documents</p>
                  <p className="text-xs text-gray-500">Registration, insurance, service records, etc.</p>
                </div>
                <input
                  ref={documentsInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentsUpload}
                  className="hidden"
                />
                
                {uploadedDocuments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-[#FF3B30]" />
                          <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add to Garage"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMotorcycleDialog;


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
import { X, Upload, Camera, FileText, ImageIcon } from "lucide-react";
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-center text-[#1A1A1A] mb-6">
            Add Your Motorcycle
          </DialogTitle>
          <Button 
            className="absolute right-0 top-0" 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Upload Section - Compact and at the top */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">Upload Files</h3>
              
              <div className="flex gap-4 justify-center">
                {/* Photo Upload */}
                <div className="flex-1">
                  <div 
                    className="bg-white rounded-full border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-[#FF3B30] transition-colors min-h-[80px] flex flex-col items-center justify-center"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {uploadedPhoto ? (
                      <div className="flex items-center space-x-2">
                        <img src={uploadedPhoto} alt="Uploaded" className="w-8 h-8 object-cover rounded-full" />
                        <span className="text-sm text-green-600 font-medium">Photo Added</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">Add Photo</span>
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

                {/* Documents Upload */}
                <div className="flex-1">
                  <div 
                    className="bg-white rounded-full border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer hover:border-[#FF3B30] transition-colors min-h-[80px] flex flex-col items-center justify-center"
                    onClick={() => documentsInputRef.current?.click()}
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600 font-medium">
                        {uploadedDocuments.length > 0 ? `${uploadedDocuments.length} Files` : "Add Documents"}
                      </span>
                    </div>
                  </div>
                  <input
                    ref={documentsInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentsUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Document List */}
              {uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                  {uploadedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-white rounded-full px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-[#FF3B30]" />
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">{doc.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 1: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center">
                <div className="w-8 h-8 bg-[#FF3B30] text-white rounded-full flex items-center justify-center text-sm mr-3">1</div>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nickname *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Beast" 
                          className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3"
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
                      <FormLabel className="text-sm font-medium text-gray-700">Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl">
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
            </div>
            
            {/* Step 2: Vehicle Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center">
                <div className="w-8 h-8 bg-[#FF3B30] text-white rounded-full flex items-center justify-center text-sm mr-3">2</div>
                Vehicle Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Make *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Honda, Yamaha, Ducati" 
                          className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3"
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
                      <FormLabel className="text-sm font-medium text-gray-700">Model *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="CBR600RR, R1, Panigale" 
                          className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Step 3: Specifications */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center">
                <div className="w-8 h-8 bg-[#FF3B30] text-white rounded-full flex items-center justify-center text-sm mr-3">3</div>
                Specifications
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Year *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2023" 
                          className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3"
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
                      <FormLabel className="text-sm font-medium text-gray-700">Engine *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="600cc" 
                          className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3"
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
                      <FormLabel className="text-sm font-medium text-gray-700">Miles/Km</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="15,000" 
                          className="rounded-full border-gray-300 focus:border-[#FF3B30] focus:ring-[#FF3B30] px-4 py-3"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className="flex gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-full border-gray-300 px-8 py-3"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full px-8 py-3"
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

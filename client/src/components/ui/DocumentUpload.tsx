import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Upload, 
  FileText, 
  Shield, 
  Car, 
  X, 
  Download,
  Eye,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Document {
  id: string;
  name: string;
  type: 'license' | 'insurance' | 'registration' | 'other';
  file: File;
  uploadDate: Date;
  expiryDate?: Date;
}

interface DocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const documentTypes = [
  { id: 'license', label: 'Driving License', icon: Shield, color: 'bg-blue-100 text-blue-800' },
  { id: 'insurance', label: 'Insurance Papers', icon: Car, color: 'bg-green-100 text-green-800' },
  { id: 'registration', label: 'Registration', icon: FileText, color: 'bg-purple-100 text-purple-800' },
  { id: 'other', label: 'Other Documents', icon: FileText, color: 'bg-gray-100 text-gray-800' }
];

const DocumentUpload = ({ open, onOpenChange }: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedType, setSelectedType] = useState<string>('license');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.includes('pdf') || file.type.includes('image')) {
        const newDoc: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: selectedType as any,
          file: file,
          uploadDate: new Date()
        };
        setDocuments(prev => [...prev, newDoc]);
      }
    });
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getTypeInfo = (type: string) => {
    return documentTypes.find(t => t.id === type) || documentTypes[3];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#FF3B30]" />
            Document Manager
          </DialogTitle>
          <DialogDescription>
            Upload and organize your important motorcycle-related documents
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Document Type Selection */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Document Type</h3>
            <div className="space-y-2">
              {documentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    className={`w-full justify-start gap-3 ${
                      selectedType === type.id 
                        ? "bg-[#FF3B30] hover:bg-[#FF3B30]/90" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Upload Area */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-4">Upload Documents</h3>
            
            {/* Drag & Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? "border-[#FF3B30] bg-[#FF3B30]/5" 
                  : "border-gray-300 hover:border-[#FF3B30]/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, JPG, PNG files up to 10MB
              </p>
              
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
              <Label htmlFor="file-upload">
                <Button className="bg-[#FF3B30] hover:bg-[#FF3B30]/90" asChild>
                  <span>Select Files</span>
                </Button>
              </Label>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Uploaded Documents ({documents.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {documents.map((doc) => {
                  const typeInfo = getTypeInfo(doc.type);
                  const IconComponent = typeInfo.icon;
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <IconComponent className="h-5 w-5 text-[#FF3B30]" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm truncate max-w-[150px]">
                                  {doc.name}
                                </h4>
                                <Badge className={typeInfo.color} variant="secondary">
                                  {typeInfo.label}
                                </Badge>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDocument(doc.id)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.uploadDate.toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90"
            onClick={() => {
              // Save documents logic would go here
              onOpenChange(false);
            }}
            disabled={documents.length === 0}
          >
            Save Documents ({documents.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUpload;
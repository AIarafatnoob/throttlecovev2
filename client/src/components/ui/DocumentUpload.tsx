import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Eye, X, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Document {
  id: string;
  name: string;
  type: 'license' | 'registration' | 'insurance' | 'pollution' | 'tax' | 'roadworthy';
  file: File | null;
  uploadDate: Date;
  expiryDate?: Date;
  isRequired: boolean;
}

const DOCUMENT_TYPES = [
  { key: 'license', name: 'Driving License', required: true, icon: '🪪' },
  { key: 'registration', name: 'Registration Certificate (RC)', required: true, icon: '📋' },
  { key: 'insurance', name: 'Vehicle Insurance Certificate', required: true, icon: '🛡️' },
  { key: 'pollution', name: 'Pollution Under Control (PUC)', required: true, icon: '🌱' },
  { key: 'tax', name: 'Tax Token', required: false, icon: '💰' },
  { key: 'roadworthy', name: 'Road Worthiness Certificate', required: false, icon: '✅' },
];

const DocumentUploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const handleFileUpload = (type: string, file: File) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: type as Document['type'],
      file: file,
      uploadDate: new Date(),
      isRequired: DOCUMENT_TYPES.find(dt => dt.key === type)?.required || false
    };

    setDocuments(prev => [...prev.filter(d => d.type !== type), newDoc]);
    setUploadingType(null);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const getDocumentForType = (type: string) => {
    return documents.find(d => d.type === type);
  };

  const getCompletionStats = () => {
    const required = DOCUMENT_TYPES.filter(dt => dt.required);
    const uploaded = required.filter(dt => getDocumentForType(dt.key));
    return { completed: uploaded.length, total: required.length };
  };

  const stats = getCompletionStats();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <FileText className="h-5 w-5 mr-2" />
            Documents ({stats.completed}/{stats.total})
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A1A1A] mb-2">
            Vehicle Documents Manager
          </DialogTitle>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Keep all your essential riding documents in one secure place
            </p>
            <Badge 
              variant={stats.completed === stats.total ? "default" : "secondary"}
              className={stats.completed === stats.total ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {stats.completed === stats.total ? "Complete" : `${stats.completed}/${stats.total} Required`}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {DOCUMENT_TYPES.map((docType) => {
            const uploadedDoc = getDocumentForType(docType.key);
            const isUploading = uploadingType === docType.key;

            return (
              <motion.div
                key={docType.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`border-2 transition-all duration-300 ${
                  uploadedDoc 
                    ? "border-green-200 bg-green-50" 
                    : docType.required 
                      ? "border-red-200 bg-red-50" 
                      : "border-gray-200 hover:border-[#FF3B30]/30"
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{docType.icon}</div>
                        <div>
                          <h3 className="font-semibold text-[#1A1A1A]">{docType.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {docType.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {uploadedDoc && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Uploaded
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {uploadedDoc && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(uploadedDoc.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {uploadedDoc ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-[#FF3B30]" />
                            <div>
                              <p className="font-medium text-sm">{uploadedDoc.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded {uploadedDoc.uploadDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="rounded-full">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label htmlFor={`file-${docType.key}`}>
                          <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 ${
                            isUploading 
                              ? "border-[#FF3B30] bg-[#FF3B30]/5" 
                              : "border-gray-300 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5"
                          }`}>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, JPG, PNG up to 10MB
                            </p>
                          </div>
                        </Label>
                        <Input
                          id={`file-${docType.key}`}
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadingType(docType.key);
                              // Simulate upload delay
                              setTimeout(() => {
                                handleFileUpload(docType.key, file);
                              }, 1000);
                            }
                          }}
                        />
                        
                        {docType.required && !uploadedDoc && (
                          <div className="flex items-center space-x-2 text-amber-600 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>This document is required for legal riding</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 mt-1">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Quick Access Tip</h4>
              <p className="text-sm text-blue-700">
                All documents are stored securely and can be quickly accessed during traffic stops or inspections. 
                Keep your device handy while riding for instant document presentation.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
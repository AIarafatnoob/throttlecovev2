import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Eye, X, Check, AlertCircle, Calendar, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: 'license' | 'registration' | 'insurance' | 'pollution' | 'tax' | 'roadworthy';
  file: File | null;
  uploadDate: Date;
  expiryDate?: Date;
  isRequired: boolean;
  fileUrl?: string;
  status: 'valid' | 'expiring' | 'expired';
}

const DOCUMENT_TYPES = [
  { 
    key: 'license', 
    name: 'Driving License', 
    required: true, 
    icon: '🪪',
    description: 'Valid driving license for motorcycle operation',
    hasExpiry: true 
  },
  { 
    key: 'registration', 
    name: 'Registration Certificate (RC)', 
    required: true, 
    icon: '📋',
    description: 'Official vehicle registration document',
    hasExpiry: false
  },
  { 
    key: 'insurance', 
    name: 'Vehicle Insurance Certificate', 
    required: true, 
    icon: '🛡️',
    description: 'Current vehicle insurance coverage',
    hasExpiry: true
  },
  { 
    key: 'pollution', 
    name: 'Pollution Under Control (PUC)', 
    required: true, 
    icon: '🌱',
    description: 'Environmental compliance certificate',
    hasExpiry: true
  },
  { 
    key: 'tax', 
    name: 'Tax Token', 
    required: false, 
    icon: '💰',
    description: 'Vehicle tax payment receipt',
    hasExpiry: true
  },
  { 
    key: 'roadworthy', 
    name: 'Road Worthiness Certificate', 
    required: false, 
    icon: '✅',
    description: 'Vehicle safety inspection certificate',
    hasExpiry: true
  },
];

const DocumentUploadDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const calculateStatus = (expiryDate?: Date): Document['status'] => {
    if (!expiryDate) return 'valid';
    const now = new Date();
    const daysDiff = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'expired';
    if (daysDiff <= 30) return 'expiring';
    return 'valid';
  };

  const handleFileUpload = (type: string, file: File) => {
    const docType = DOCUMENT_TYPES.find(dt => dt.key === type);
    const expiryDateStr = expiryDates[type];
    const expiryDate = expiryDateStr ? new Date(expiryDateStr) : undefined;
    
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: type as Document['type'],
      file: file,
      uploadDate: new Date(),
      expiryDate,
      isRequired: docType?.required || false,
      fileUrl: URL.createObjectURL(file),
      status: calculateStatus(expiryDate)
    };

    setDocuments(prev => [...prev.filter(d => d.type !== type), newDoc]);
    setUploadingType(null);
    
    toast({
      title: "Document uploaded successfully",
      description: `${docType?.name} has been added to your collection.`,
    });
  };

  const removeDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.fileUrl) {
      URL.revokeObjectURL(doc.fileUrl);
    }
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Document removed",
      description: "The document has been removed from your collection.",
    });
  };

  const handleExpiryDateChange = (type: string, date: string) => {
    setExpiryDates(prev => ({ ...prev, [type]: date }));
    
    // Update existing document if it exists
    const existingDoc = documents.find(d => d.type === type);
    if (existingDoc) {
      const newExpiryDate = date ? new Date(date) : undefined;
      const updatedDoc = {
        ...existingDoc,
        expiryDate: newExpiryDate,
        status: calculateStatus(newExpiryDate)
      };
      setDocuments(prev => prev.map(d => d.id === existingDoc.id ? updatedDoc : d));
    }
  };

  const getDocumentForType = (type: string) => {
    return documents.find(d => d.type === type);
  };

  const getCompletionStats = () => {
    const required = DOCUMENT_TYPES.filter(dt => dt.required);
    const uploaded = required.filter(dt => getDocumentForType(dt.key));
    const expiring = documents.filter(d => d.status === 'expiring').length;
    const expired = documents.filter(d => d.status === 'expired').length;
    return { completed: uploaded.length, total: required.length, expiring, expired };
  };

  const stats = getCompletionStats();

  const getStatusBadge = (document: Document) => {
    switch (document.status) {
      case 'expired':
        return <Badge variant="destructive" className="text-xs">Expired</Badge>;
      case 'expiring':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Expiring Soon</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 text-xs"><Check className="h-3 w-3 mr-1" />Valid</Badge>;
    }
  };

  const handleViewDocument = (document: Document) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleQuickAccess = (documentType: string) => {
    const doc = getDocumentForType(documentType);
    if (doc) {
      handleViewDocument(doc);
    } else {
      toast({
        title: "Document not found",
        description: `Please upload your ${DOCUMENT_TYPES.find(dt => dt.key === documentType)?.name} first.`,
        variant: "destructive",
      });
    }
    setShowQuickActions(false);
  };

  const toggleQuickActions = () => {
    if (showQuickActions) {
      setShowQuickActions(false);
    } else {
      setShowQuickActions(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        {/* Quick Action Buttons */}
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => handleQuickAccess('license')}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-4 py-2 shadow-md text-sm"
                size="sm"
              >
                🪪 License
              </Button>
              <Button
                onClick={() => handleQuickAccess('insurance')}
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-4 py-2 shadow-md text-sm"
                size="sm"
              >
                🛡️ Insurance
              </Button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setShowQuickActions(false)}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-4 py-2 shadow-md text-sm"
                    size="sm"
                  >
                    ⋯ All Documents
                  </Button>
                </DialogTrigger>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Document Button */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={toggleQuickActions}
            className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="sm"
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <div className="flex space-x-1">
                {DOCUMENT_TYPES.map((docType) => {
                  const doc = getDocumentForType(docType.key);
                  const dotColor = doc 
                    ? doc.status === 'expired' 
                      ? 'bg-red-300/70' 
                      : doc.status === 'expiring' 
                        ? 'bg-amber-300/70' 
                        : 'bg-emerald-300/70'
                    : 'bg-gray-300/50';
                  
                  return (
                    <div
                      key={docType.key}
                      className={`w-1.5 h-1.5 rounded-full ${dotColor} transition-colors duration-300`}
                      title={docType.name}
                    />
                  );
                })}
              </div>
            </div>
          </Button>
        </motion.div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A1A1A] mb-2">
            Vehicle Documents Manager
          </DialogTitle>
          <DialogDescription className="text-gray-600 mb-4">
            Keep all your essential riding documents in one secure place. Required for legal riding in Bangladesh.
          </DialogDescription>
          
          {/* Status Overview */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge 
              variant={stats.completed === stats.total ? "default" : "secondary"}
              className={stats.completed === stats.total ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              <Shield className="h-3 w-3 mr-1" />
              {stats.completed === stats.total ? "All Required Docs Complete" : `${stats.completed}/${stats.total} Required`}
            </Badge>
            
            {stats.expiring > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Calendar className="h-3 w-3 mr-1" />
                {stats.expiring} Expiring Soon
              </Badge>
            )}
            
            {stats.expired > 0 && (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                {stats.expired} Expired
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {DOCUMENT_TYPES.map((docType) => {
            const uploadedDoc = getDocumentForType(docType.key);
            const isUploading = uploadingType === docType.key;

            return (
              <motion.div
                key={docType.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden h-full ${
                  uploadedDoc?.status === 'expired' ? 'ring-2 ring-red-200' :
                  uploadedDoc?.status === 'expiring' ? 'ring-2 ring-yellow-200' :
                  uploadedDoc ? 'ring-2 ring-green-200' : ''
                }`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-[#FF3B30] rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl">
                          {docType.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base text-[#1A1A1A] truncate leading-tight">{docType.name}</h3>
                          <p className="text-gray-500 text-xs truncate">{docType.description}</p>
                          <div className="flex items-center flex-wrap gap-1 mt-1">
                            {docType.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                            {uploadedDoc && getStatusBadge(uploadedDoc)}
                          </div>
                        </div>
                      </div>
                      
                      {uploadedDoc && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(uploadedDoc.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-8 w-8 p-0 rounded-xl"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {uploadedDoc ? (
                      <div className="space-y-3 flex-1">
                        {/* Document Status Section */}
                        <div className="bg-gray-50 rounded-2xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-[#FF3B30]" />
                              <span className="text-sm font-medium text-[#1A1A1A]">Document Ready</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="rounded-full h-8 w-8 p-0"
                              onClick={() => handleViewDocument(uploadedDoc)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{uploadedDoc.name}</p>
                          <p className="text-xs text-gray-400">
                            Added {uploadedDoc.uploadDate.toLocaleDateString()}
                          </p>
                        </div>

                        {/* Expiry Status */}
                        {uploadedDoc.expiryDate && (
                          <div className={`rounded-2xl p-3 ${
                            uploadedDoc.status === 'expired' ? 'bg-red-50 border border-red-200' :
                            uploadedDoc.status === 'expiring' ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-green-50 border border-green-200'
                          }`}>
                            <div className="flex items-center space-x-2 mb-1">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {uploadedDoc.status === 'expired' ? 'Expired' : 
                                 uploadedDoc.status === 'expiring' ? 'Expiring Soon' : 'Valid'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {uploadedDoc.status === 'expired' ? 'Expired' : 'Expires'}: {uploadedDoc.expiryDate.toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {/* Quick Expiry Update */}
                        {docType.hasExpiry && (
                          <div className="space-y-2">
                            <Label htmlFor={`expiry-${docType.key}`} className="text-xs font-medium text-gray-600">
                              Update Expiry Date
                            </Label>
                            <Input
                              id={`expiry-${docType.key}`}
                              type="date"
                              value={expiryDates[docType.key] || (uploadedDoc.expiryDate ? uploadedDoc.expiryDate.toISOString().split('T')[0] : '')}
                              onChange={(e) => handleExpiryDateChange(docType.key, e.target.value)}
                              className="text-sm h-8"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 flex-1">
                        {/* Combined Upload & Expiry Section */}
                        <div className="space-y-3">
                          {/* File Upload Area */}
                          <Label htmlFor={`file-${docType.key}`}>
                            <div className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
                              isUploading 
                                ? "border-[#FF3B30] bg-[#FF3B30]/5" 
                                : "border-gray-300 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5"
                            }`}>
                              {isUploading ? (
                                <div className="flex flex-col items-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF3B30] mb-2"></div>
                                  <p className="text-xs text-[#FF3B30] font-medium">Uploading...</p>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                  <p className="text-sm text-gray-600 font-medium">Upload Document</p>
                                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                                </>
                              )}
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
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({
                                    title: "File too large",
                                    description: "Please select a file smaller than 10MB.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setUploadingType(docType.key);
                                setTimeout(() => {
                                  handleFileUpload(docType.key, file);
                                }, 1500);
                              }
                            }}
                            ref={(el) => fileInputRefs.current[docType.key] = el}
                          />
                          
                          {/* Integrated Expiry Date Input */}
                          {docType.hasExpiry && (
                            <div className="bg-gray-50 rounded-2xl p-3">
                              <Label htmlFor={`new-expiry-${docType.key}`} className="text-xs font-medium mb-2 block text-gray-600">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                Set Expiry Date (Optional)
                              </Label>
                              <Input
                                id={`new-expiry-${docType.key}`}
                                type="date"
                                value={expiryDates[docType.key] || ''}
                                onChange={(e) => handleExpiryDateChange(docType.key, e.target.value)}
                                className="text-sm h-8 bg-white"
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Status Footer */}
                        {docType.required && (
                          <div className="flex items-center space-x-2 text-amber-700 text-xs bg-amber-50 p-2 rounded-xl border border-amber-200">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span>Required for legal riding</span>
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

        {/* Quick Access Section */}
        {documents.length > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-1">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2">Quick Access Ready</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Your documents are securely stored and ready for instant access during traffic stops or inspections.
                </p>
                <div className="flex flex-wrap gap-2">
                  {documents.map((doc) => (
                    <Button
                      key={doc.id}
                      size="sm"
                      variant="outline"
                      className="bg-white border-blue-200 hover:bg-blue-50 text-blue-900"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <span className="mr-2">{DOCUMENT_TYPES.find(dt => dt.key === doc.type)?.icon}</span>
                      {DOCUMENT_TYPES.find(dt => dt.key === doc.type)?.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="text-gray-500 mt-1">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Important Reminder</h4>
              <p className="text-sm text-gray-600">
                In Bangladesh, carrying required documents while riding is mandatory. Digital copies are legally acceptable 
                for most inspections, but always verify current regulations with local authorities.
              </p>
            </div>
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUploadDialog;
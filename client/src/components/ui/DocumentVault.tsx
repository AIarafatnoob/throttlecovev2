import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { 
  Upload, 
  Shield, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Download,
  Trash2,
  Lock,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Document types for the vault
const DOCUMENT_TYPES = [
  { key: 'license', name: 'Driver License', icon: '🪪', color: 'bg-blue-500' },
  { key: 'registration', name: 'Vehicle Registration', icon: '📋', color: 'bg-green-500' },
  { key: 'insurance', name: 'Insurance Certificate', icon: '🛡️', color: 'bg-purple-500' },
  { key: 'service', name: 'Service Record', icon: '🔧', color: 'bg-orange-500' },
  { key: 'warranty', name: 'Warranty Document', icon: '📄', color: 'bg-cyan-500' },
  { key: 'manual', name: 'Owner Manual', icon: '📖', color: 'bg-gray-500' },
  { key: 'receipt', name: 'Purchase Receipt', icon: '🧾', color: 'bg-yellow-500' },
  { key: 'other', name: 'Other Document', icon: '📁', color: 'bg-indigo-500' }
];

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  expiryDate?: Date;
  size: number;
  url: string;
  isSecure: boolean;
  notes?: string;
  vehicleId?: string;
}

interface DocumentVaultProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
  selectedDocumentType?: string | null;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ 
  isOpen, 
  onClose, 
  documents, 
  onDocumentsChange, 
  selectedDocumentType 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDocumentViewOpen, setIsDocumentViewOpen] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: "",
    type: "",
    notes: "",
    expiryDate: "",
    isSecure: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get document status
  const getDocumentStatus = (doc: Document) => {
    if (!doc.expiryDate) return { status: 'no-expiry', color: 'text-gray-500', bgColor: 'bg-gray-100', icon: CheckCircle };

    const daysUntilExpiry = Math.ceil((doc.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return { status: 'expired', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertTriangle };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertTriangle };
    } else {
      return { status: 'valid', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle };
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload - in real app this would upload to server
      const newDocument: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: uploadForm.name || file.name,
        type: uploadForm.type,
        uploadDate: new Date(),
        expiryDate: uploadForm.expiryDate ? new Date(uploadForm.expiryDate) : undefined,
        size: file.size,
        url: URL.createObjectURL(file),
        isSecure: uploadForm.isSecure,
        notes: uploadForm.notes
      };

      onDocumentsChange([...documents, newDocument]);

      toast({
        title: "Document uploaded",
        description: `${newDocument.name} has been securely stored in your vault.`,
      });

      // Reset form
      setUploadForm({
        name: "",
        type: "",
        notes: "",
        expiryDate: "",
        isSecure: true
      });
      setShowUploadForm(false);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== docId));
    setDeleteConfirmId(null);
    toast({
      title: "Document deleted",
      description: "Document has been permanently removed from your vault.",
    });
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDocumentViewOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Main Vault Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-blue-500" />
              Document Vault
            </DialogTitle>
            <DialogDescription className="text-sm">
              Securely store and manage your vehicle documents, licenses, and important paperwork.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Document Grid */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-0">
              {documents.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Your vault is empty
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">
                    Upload your first document to get started with secure storage.
                  </p>
                  <Button onClick={() => setShowUploadForm(true)} className="text-sm sm:text-base">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => {
                    const docType = DOCUMENT_TYPES.find(type => type.key === doc.type);
                    const statusInfo = getDocumentStatus(doc);

                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`transition-all duration-200 hover:shadow-md ${statusInfo.bgColor} rounded-2xl sm:rounded-full`}>
                          <CardContent className="p-3 sm:p-4">
                            {/* Mobile: Stack vertically, Desktop: Horizontal */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              {/* Document info section */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${docType?.color || 'bg-gray-500'} flex items-center justify-center text-white text-base sm:text-lg shrink-0`}>
                                  {docType?.icon || '📄'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                                    {doc.name}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                                    {docType?.name || 'Document'} • {formatFileSize(doc.size)}
                                  </p>
                                </div>
                              </div>

                              {/* Status and actions section */}
                              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-wrap">
                                {/* Status indicators */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                  {doc.isSecure && (
                                    <div className="flex items-center gap-1">
                                      <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                                      <span className="text-xs text-green-600 font-medium">Secure</span>
                                    </div>
                                  )}
                                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                                    <statusInfo.icon className="h-3 w-3" />
                                    <span className="text-xs font-medium">
                                      {statusInfo.status === 'expired' ? 'Expired' :
                                       statusInfo.status === 'expiring' ? 'Soon' :
                                       statusInfo.status === 'valid' ? 'Valid' : 'No Expiry'}
                                    </span>
                                  </div>
                                </div>

                                {/* Expiry date */}
                                {doc.expiryDate && (
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                      {statusInfo.status === 'expired' ? 'Expired' : 'Expires'}
                                    </p>
                                    <p className={`text-xs font-medium ${statusInfo.color}`}>
                                      {formatDate(doc.expiryDate)}
                                    </p>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDocument(doc)}
                                    className="h-8 px-2 sm:px-3 rounded-full text-xs sm:text-sm"
                                  >
                                    <Eye className="h-3 w-3 sm:mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDeleteConfirmId(doc.id)}
                                    className="h-8 px-2 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Floating Add Document Button */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <Button 
              onClick={() => setShowUploadForm(true)} 
              className="rounded-full bg-[#FF3B30] hover:bg-[#FF3B30]/90 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Document</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Form Dialog */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Upload Document</DialogTitle>
            <DialogDescription className="text-sm">
              Add a new document to your secure vault.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-name" className="text-sm font-medium">Document Name</Label>
              <Input
                id="document-name"
                placeholder="Enter document name..."
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-type" className="text-sm font-medium">Document Type</Label>
              <Select value={uploadForm.type} onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select document type..." />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.key} value={type.key} className="text-base py-3">
                      {type.icon} {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-date" className="text-sm font-medium">Expiry Date (Optional)</Label>
              <Input
                id="expiry-date"
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) => setUploadForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document-notes" className="text-sm font-medium">Notes (Optional)</Label>
              <Textarea
                id="document-notes"
                placeholder="Add any notes about this document..."
                value={uploadForm.notes}
                onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="text-base resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select File</Label>
              <div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-12 text-base"
                  disabled={isUploading || !uploadForm.type}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500">
                Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadForm(false)}
                className="h-11 text-base"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !uploadForm.name || !uploadForm.type}
                className="h-11 text-base flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document View Dialog */}
      <Dialog open={isDocumentViewOpen} onOpenChange={setIsDocumentViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedDocument && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedDocument.name}
                </DialogTitle>
                <DialogDescription>
                  {DOCUMENT_TYPES.find(type => type.key === selectedDocument.type)?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Document preview coming soon</p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDeleteDocument(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentVault;
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
  X, 
  Eye,
  Download,
  Trash2,
  Lock,
  Unlock,
  Search,
  Filter,
  Plus,
  Camera
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
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ isOpen, onClose }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
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

  // Filter documents based on search and type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (doc: Document) => {
    if (!doc.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((doc.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  // Check if document is expired
  const isExpired = (doc: Document) => {
    if (!doc.expiryDate) return false;
    return doc.expiryDate < new Date();
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

      setDocuments(prev => [...prev, newDocument]);
      
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
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Document Vault
            </DialogTitle>
            <DialogDescription>
              Securely store and manage your vehicle documents, licenses, and important paperwork.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Search and Filter Bar */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.icon} {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowUploadForm(true)} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>

            {/* Document Grid */}
            <div className="flex-1 overflow-y-auto">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {documents.length === 0 ? "Your vault is empty" : "No documents found"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {documents.length === 0 
                      ? "Upload your first document to get started with secure storage."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {documents.length === 0 && (
                    <Button onClick={() => setShowUploadForm(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First Document
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => {
                    const docType = DOCUMENT_TYPES.find(type => type.key === doc.type);
                    const expiring = isExpiringSoon(doc);
                    const expired = isExpired(doc);
                    
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          expired ? 'border-red-200 bg-red-50' : 
                          expiring ? 'border-yellow-200 bg-yellow-50' : 
                          'border-gray-200'
                        }`}>
                          <CardContent className="p-4">
                            {/* Document Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg ${docType?.color || 'bg-gray-500'} flex items-center justify-center text-white text-sm`}>
                                  {docType?.icon || '📄'}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    {docType?.name || 'Document'}
                                  </span>
                                  {doc.isSecure && (
                                    <Lock className="h-3 w-3 text-green-500" />
                                  )}
                                </div>
                              </div>
                              
                              {/* Status Indicators */}
                              <div className="flex items-center gap-1">
                                {expired && (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )}
                                {expiring && !expired && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </div>

                            {/* Document Title */}
                            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {doc.name}
                            </h4>

                            {/* Document Info */}
                            <div className="space-y-1 text-xs text-gray-500 mb-3">
                              <div>Uploaded: {formatDate(doc.uploadDate)}</div>
                              {doc.expiryDate && (
                                <div className={expired ? 'text-red-600' : expiring ? 'text-yellow-600' : ''}>
                                  Expires: {formatDate(doc.expiryDate)}
                                </div>
                              )}
                              <div>Size: {formatFileSize(doc.size)}</div>
                            </div>

                            {/* Notes */}
                            {doc.notes && (
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {doc.notes}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDocument(doc)}
                                className="flex-1"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirmId(doc.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
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
        </DialogContent>
      </Dialog>

      {/* Upload Form Dialog */}
      <Dialog open={showUploadForm} onOpenChange={setShowUploadForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
            <DialogDescription>
              Add a new document to your secure vault.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                placeholder="Enter document name..."
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={uploadForm.type} onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type..." />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map(type => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.icon} {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
              <Input
                id="expiry-date"
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) => setUploadForm(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="document-notes">Notes (Optional)</Label>
              <Textarea
                id="document-notes"
                placeholder="Add any notes about this document..."
                value={uploadForm.notes}
                onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div>
              <Label>Select File</Label>
              <div className="mt-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                  disabled={isUploading || !uploadForm.type}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
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
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                Cancel
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
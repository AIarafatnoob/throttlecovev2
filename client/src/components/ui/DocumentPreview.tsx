import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Eye, Download, Calendar, FileText, Shield, AlertTriangle } from "lucide-react";

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

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  isOpen, 
  onClose, 
  document 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!document) return null;

  const isExpiringSoon = () => {
    if (!document.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((document.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    if (!document.expiryDate) return false;
    return new Date() > document.expiryDate;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insurance': return 'bg-blue-100 text-blue-800';
      case 'license': return 'bg-green-100 text-green-800';
      case 'registration': return 'bg-purple-100 text-purple-800';
      case 'service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(document.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {document.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(document.type)}>
                        {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                      </Badge>
                      {document.isSecure && (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          <Shield className="w-3 h-3 mr-1" />
                          Secure
                        </Badge>
                      )}
                      {isExpired() && (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Expired
                        </Badge>
                      )}
                      {isExpiringSoon() && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Expires Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Document Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      Upload Date
                    </div>
                    <p className="text-gray-900 font-medium">
                      {formatDate(document.uploadDate)}
                    </p>
                  </div>
                  {document.expiryDate && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Expiry Date
                      </div>
                      <p className={`font-medium ${
                        isExpired() ? 'text-red-600' : 
                        isExpiringSoon() ? 'text-orange-600' : 
                        'text-gray-900'
                      }`}>
                        {formatDate(document.expiryDate)}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      File Size
                    </div>
                    <p className="text-gray-900 font-medium">
                      {formatFileSize(document.size)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {document.notes && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 text-sm">{document.notes}</p>
                    </div>
                  </div>
                )}

                {/* Document Preview */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Document Preview</h3>
                  <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                    {document.url.endsWith('.pdf') ? (
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">PDF Document</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.url, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View PDF
                        </Button>
                      </div>
                    ) : (
                      <img 
                        src={document.url} 
                        alt={document.name}
                        className="max-w-full max-h-[300px] object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isLoading ? 'Downloading...' : 'Download'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(document.url, '_blank')}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Original
                  </Button>
                </div>
              </div>
            </CardContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
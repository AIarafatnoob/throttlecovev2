import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  if (!document) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Document title overlay */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">{document.name}</p>
            <p className="text-xs opacity-75">
              {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
            </p>
          </div>

          {/* Fullscreen document */}
          <div className="w-full h-full flex items-center justify-center p-4">
            {document.url.endsWith('.pdf') ? (
              <iframe
                src={document.url}
                className="w-full h-full border-0 rounded-lg"
                title={document.name}
              />
            ) : (
              <img 
                src={document.url} 
                alt={document.name}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
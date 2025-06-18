import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";

interface PhotoUploadProps {
  onPhotoSelect: (file: File | null) => void;
  currentPhoto?: string;
  label?: string;
  className?: string;
}

const PhotoUpload = ({ onPhotoSelect, currentPhoto, label = "Upload Photo", className = "" }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      onPhotoSelect(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FF3B30] transition-colors">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 rounded-full p-1 h-8 w-8"
              onClick={handleRemovePhoto}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={handleClick}>
            <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Click to upload photo</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="w-full rounded-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Photo
        </Button>
      )}
    </div>
  );
};

export default PhotoUpload;
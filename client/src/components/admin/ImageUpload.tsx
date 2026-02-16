import React from "react";
import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

/**
 * ImageUpload Component
 * 
 * A drag-and-drop image upload component for the admin dashboard.
 * 
 * Features:
 * - Drag and drop file upload
 * - Click to browse file selection
 * - Image preview
 * - Option to use URL instead of upload
 * - File validation (images only, max 5MB)
 * - Progress indication during upload
 * 
 * Usage:
 * <ImageUpload 
 *   value={imageUrl} 
 *   onChange={(url) => setImageUrl(url)}
 *   label="Hero Image"
 * />
 * 
 * Security:
 * - Requires admin JWT token (automatically included by apiRequest)
 * - Server-side validation of file type and size
 * - Only authenticated admins can upload files
 */
export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file upload to server
   * Sends file to /api/upload endpoint with admin authentication
   */
  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // Get admin token from localStorage
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload to server
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.url); // Update parent component with new URL
    } catch (error: any) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Handle file selection via input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Clear uploaded image
  const handleClear = () => {
    onChange("");
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setUseUrl(!useUrl)}
          className="text-xs"
        >
          {useUrl ? "Use Upload" : "Use URL Instead"}
        </Button>
      </div>

      {useUrl ? (
        // URL Input Mode
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        // Upload Mode
        <>
          {!value ? (
            // Upload Area
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors
                ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50"}
                ${isUploading ? "opacity-50 pointer-events-none" : ""}
              `}
              onClick={handleBrowseClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col items-center gap-2">
                <Upload className={`w-12 h-12 ${isDragging ? "text-primary" : "text-gray-400"}`} />
                <div>
                  <p className="font-medium">
                    {isUploading ? "Uploading..." : "Drop image here or click to browse"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG, GIF or WebP (max 5MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Image Preview
            <div className="relative border rounded-lg overflow-hidden">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText, X } from "lucide-react";
import { useTransactions } from "@/contexts/TransactionContext";
import { getApiBaseUrl } from "@/lib/api";

export default function UploadReceiptModal({ open, onOpenChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { addTransaction } = useTransactions();

  const parseAmountFromText = (text) => {
    if (!text) return null;
    const normalized = text.replace(/[,\s]/g, ' ');
    const moneyMatches = normalized.match(/\b(\d{1,3}(?:[\s]\d{3})*(?:\.\d{2})|\d+\.\d{2}|\d{1,3}(?:[\s]\d{3})+)\b/g);
    if (!moneyMatches) return null;
    const toNumber = (s) => parseFloat(s.replace(/\s/g, ''));
    const candidates = moneyMatches.map(toNumber).filter((n) => !Number.isNaN(n) && n > 0);
    if (candidates.length === 0) return null;
    // Heuristic: use the maximum value as total amount
    return Math.max(...candidates);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, JPG, or PNG file');
        return;
      }

      // Temporary: OCR backend supports images; PDFs are not processed.
      if (file.type === 'application/pdf') {
        alert('OCR currently supports images (JPG/PNG). Please upload an image.');
        return;
      }

      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setOcrText("");
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    try {
      setIsUploading(true);
      const form = new FormData();
      form.append('receipt', selectedFile);
      const base = getApiBaseUrl();
      const response = await fetch(`${base}/ocr-upload`, { method: 'POST', body: form });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      const data = await response.json();
      const text = data.text || '';
      setOcrText(text);

      // Create a transaction so it appears on Dashboard/Transactions
      const amount = parseAmountFromText(text);
      if (amount) {
        try {
          await addTransaction({
            description: selectedFile?.name?.split('.')?.[0] || 'Receipt OCR',
            amount: Number(amount.toFixed(2)),
            category: 'Other',
            date: new Date().toISOString(),
            type: 'expense',
            paymentMethod: 'Cash',
          });
        } catch (_) {
          // Ignore if user is not logged in or backend storage fails.
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Receipt</DialogTitle>
          <DialogDescription>
            Upload a receipt file (PDF, JPG, or PNG format)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpload}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Select File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon" className="h-10 w-10">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-accent/20 dark:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div className="border rounded-lg p-4">
                    <Label className="text-sm font-medium mb-2 block">Preview</Label>
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt="Receipt preview"
                        className="max-w-full max-h-64 object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {errorMessage && (
              <div className="text-sm text-red-600 dark:text-red-400">{errorMessage}</div>
            )}
            {ocrText && (
              <div className="border rounded-lg p-4 bg-accent/10">
                <Label className="text-sm font-medium mb-2 block">Extracted Text</Label>
                <div className="max-h-48 overflow-auto whitespace-pre-wrap text-sm">
                  {ocrText}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isUploading}>
              {isUploading ? 'Processing…' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
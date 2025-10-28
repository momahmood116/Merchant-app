import { useState } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';
import { UploadedDocument } from '../../types/application';
import { toast } from 'sonner@2.0.3';

interface BusinessDocumentsProps {
  documents: UploadedDocument[];
  onChange: (documents: UploadedDocument[]) => void;
}

export function BusinessDocuments({ documents, onChange }: BusinessDocumentsProps) {
  const [uploading, setUploading] = useState(false);

  const requiredDocs = [
    { id: 'rent_contract', label: 'Rent Contract / Shop Ownership Certificate' },
    { id: 'approval_cert', label: 'Approval Certificates (MoH, MoI, MoT - if applicable)' },
  ];

  const handleFileUpload = (docId: string, label: string, file: File) => {
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newDoc: UploadedDocument = {
        id: `${docId}-${Date.now()}`,
        name: file.name,
        type: docId,
        data: reader.result as string,
      };

      onChange([...documents, newDoc]);
      toast.success(`${label} uploaded successfully`);
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = (id: string) => {
    onChange(documents.filter(doc => doc.id !== id));
    toast.success('Document removed');
  };

  return (
    <div className="space-y-6">
      {requiredDocs.map((docType) => (
        <div key={docType.id} className="space-y-3">
          <label className="block">
            {docType.label}
          </label>

          <label className="relative block border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 transition-all cursor-pointer hover:bg-muted/50">
            <input
              type="file"
              accept="image/*,.pdf"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => handleFileUpload(docType.id, docType.label, file));
              }}
              className="hidden"
            />

            <div className="text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm">Click to upload {docType.label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </label>

          {documents.filter(doc => doc.type === docType.id).length > 0 && (
            <div className="space-y-2">
              {documents
                .filter(doc => doc.type === docType.id)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl"
                  >
                    <FileCheck className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm truncate">{doc.name}</span>
                    <button
                      onClick={() => handleRemove(doc.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

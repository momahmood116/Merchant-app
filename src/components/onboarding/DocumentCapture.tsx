import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Camera, FileCheck, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Nationality, DocumentData } from '../../types/application';
import { toast } from 'sonner@2.0.3';

interface DocumentCaptureProps {
  nationality: Nationality;
  documents: DocumentData[];
  onDocumentsUpdate: (documents: DocumentData[]) => void;
}

export function DocumentCapture({ nationality, documents, onDocumentsUpdate }: DocumentCaptureProps) {
  const [uploading, setUploading] = useState<string | null>(null);

  const documentTypes = nationality === 'Iraqi'
    ? [
        { type: 'national_id' as const, label: 'National ID', sides: ['Front', 'Back'] },
        { type: 'residential_id' as const, label: 'Residential ID', sides: ['Front', 'Back'] },
      ]
    : [
        { type: 'passport' as const, label: 'Passport', sides: ['Front', 'Back'] },
        { type: 'residential_id' as const, label: 'Residential ID', sides: ['Front', 'Back'] },
      ];

  const handleFileUpload = async (
    docType: 'national_id' | 'passport' | 'residential_id',
    side: 'front' | 'back',
    file: File
  ) => {
    setUploading(`${docType}-${side}`);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        
        // Simulate OCR extraction
        const extractedData = {
          fullName: 'Ahmad Hassan',
          motherName: 'Fatima Hassan',
          dateOfBirth: '1985-05-15',
          placeOfBirth: 'Baghdad',
          nationalId: 'IQ123456789',
          gender: 'Male' as const,
          issueDate: '2020-01-01',
          expiryDate: '2030-01-01',
        };

        const existingDoc = documents.find(d => d.type === docType);
        const updatedDoc: DocumentData = existingDoc || { type: docType };

        if (side === 'front') {
          updatedDoc.frontImage = base64;
        } else {
          updatedDoc.backImage = base64;
        }

        // Add extracted data when front is uploaded
        if (side === 'front') {
          updatedDoc.extractedData = extractedData;
        }

        const otherDocs = documents.filter(d => d.type !== docType);
        onDocumentsUpdate([...otherDocs, updatedDoc]);

        toast.success(`${docType} ${side} uploaded successfully`);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const getDocumentImage = (docType: string, side: 'front' | 'back') => {
    const doc = documents.find(d => d.type === docType);
    return side === 'front' ? doc?.frontImage : doc?.backImage;
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="mb-1">Please ensure:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Documents are clear and legible</li>
            <li>All four corners are visible</li>
            <li>No glare or shadows</li>
            <li>Documents are valid and not expired</li>
          </ul>
        </div>
      </div>

      {documentTypes.map((docType, index) => (
        <motion.div
          key={docType.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-primary flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {docType.label}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {docType.sides.map((side) => {
              const sideKey = side.toLowerCase() as 'front' | 'back';
              const image = getDocumentImage(docType.type, sideKey);
              const isUploading = uploading === `${docType.type}-${sideKey}`;

              return (
                <div key={side} className="space-y-2">
                  <label className="block text-sm">{side}</label>
                  
                  <label
                    className={`relative block border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
                      image
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(docType.type, sideKey, file);
                        }
                      }}
                      className="hidden"
                    />

                    {image ? (
                      <div className="space-y-3">
                        <img
                          src={image}
                          alt={`${docType.label} ${side}`}
                          className="w-full h-40 object-cover rounded-xl"
                        />
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <FileCheck className="w-5 h-5" />
                          <span className="text-sm">Uploaded</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        {isUploading ? (
                          <div className="space-y-3">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                            <div>
                              <p className="text-sm">
                                Click to upload or take photo
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </label>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

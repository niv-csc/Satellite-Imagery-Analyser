import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { analyzeSatelliteImage, SatelliteAnalysis } from '../services/geminiService';
import { fileToBase64 } from '../utils/helpers';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (data: SatelliteAnalysis & { fileUrl: string }) => void;
}

export default function UploadModal({ isOpen, onClose, onAnalysisComplete }: UploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      // 1. Upload to server
      const formData = new FormData();
      formData.append('image', file);
      
      const uploadRes = await axios.post('/api/upload', formData);
      setProgress(40);

      // 2. Analyze with Gemini
      const base64 = await fileToBase64(file);
      const analysis = await analyzeSatelliteImage(base64, file.type);
      setProgress(80);

      // 3. Save analysis to DB
      await axios.post('/api/save-analysis', {
        filename: uploadRes.data.filename,
        originalName: uploadRes.data.originalName,
        analysis
      });

      onAnalysisComplete({ ...analysis, fileUrl: uploadRes.data.fileUrl });
      toast.success('Analysis complete!');
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Analysis failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onAnalysisComplete, onClose]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
    multiple: false
  } as any);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-bg-secondary w-full max-w-md rounded-2xl border border-border-color p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upload Imagery</h2>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                ${isDragActive ? 'border-accent-primary bg-accent-primary/5' : 'border-border-color hover:border-accent-primary/50'}
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-accent-primary" size={40} />
                  <p className="text-sm text-gray-400">Processing satellite data... {progress}%</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-bg-tertiary rounded-full">
                    <Upload className="text-accent-primary" size={32} />
                  </div>
                  <div>
                    <p className="font-medium">Drag & drop image</p>
                    <p className="text-xs text-gray-500 mt-1">Supports JPEG, PNG, TIFF (Max 10MB)</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <span className="text-[10px] uppercase tracking-widest text-accent-primary font-bold bg-accent-primary/10 px-3 py-1 rounded-full">
                AI Verification Enabled
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

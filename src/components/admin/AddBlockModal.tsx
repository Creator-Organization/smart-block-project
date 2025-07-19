'use client';

import { useState } from 'react';
import { CreateBlockRequest } from '@/lib/types';
import BlockForm from '@/components/blocks/BlockForm';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface AddBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBlockRequest) => Promise<void>;
}

export default function AddBlockModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: AddBlockModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateBlockRequest) => {
    setLoading(true);
    setError(null);

    try {
      await onSubmit(data);
      setSuccess(true);
      
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create block');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Block</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {success && (
              <div className="flex items-center justify-center py-8 text-green-600">
                <CheckCircle className="h-12 w-12 mr-3" />
                <div>
                  <p className="text-lg font-semibold">Block Created!</p>
                  <p className="text-sm text-gray-600">Closing automatically...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            {!success && (
              <BlockForm
                onSubmit={handleSubmit}
                onCancel={handleClose}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
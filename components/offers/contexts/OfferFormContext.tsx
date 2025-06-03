'use client';

import React, { createContext, useContext, useState } from 'react';
import { SendOfferFormData } from '../schema'; // Adjust path if needed
import supabase from '@/utils/supabase/client'; // Import Supabase client
import { useAuth } from '@/utils/supabase/AuthContext'; // Import auth hook

interface OfferFormContextType {
  uploadFile: (
    file: File,
  ) => Promise<{
    name: string;
    size: number;
    type: string;
    url: string;
  } | null>;
  uploading: boolean;
}

const OfferFormContext = createContext<OfferFormContextType | undefined>(
  undefined,
);

export const OfferFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth(); // Get user from auth context

  const uploadFile = async (
    file: File,
  ): Promise<{
    name: string;
    size: number;
    type: string;
    url: string;
  } | null> => {
    setUploading(true);
    console.log('Uploading file:', file.name);

    if (!user) {
      console.error('User not logged in');
      setUploading(false);
      return null;
    }

    try {
      const filePath = `public/offer-attachments/${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('files')
        .upload(filePath, file); // Ensure 'files' bucket exists
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);
      if (!urlData?.publicUrl) throw new Error('Failed to get public URL');

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const value = {
    uploadFile,
    uploading,
  };

  return (
    <OfferFormContext.Provider value={value}>
      {children}
    </OfferFormContext.Provider>
  );
};

export const useOfferForm = (): OfferFormContextType => {
  const context = useContext(OfferFormContext);
  if (context === undefined) {
    throw new Error('useOfferForm must be used within an OfferFormProvider');
  }
  return context;
};

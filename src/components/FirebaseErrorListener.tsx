
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // In development, this will trigger the Next.js error overlay if unhandled.
      // We throw it to ensure it's surfaced correctly for debugging.
      console.error(error.message);
      
      toast({
        variant: "destructive",
        title: "Security Rule Denied",
        description: "Check the console for contextual details about this Firestore request.",
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}

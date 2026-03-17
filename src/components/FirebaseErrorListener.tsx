
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      // Surface the error to the Next.js development overlay for rapid debugging.
      // This provides full context about the denied path, method, and auth state.
      toast({
        variant: "destructive",
        title: "Security Rule Denied",
        description: "Firestore denied this request. Check the error overlay for details.",
      });

      // Throwing ensures the developer sees the specialized FirestorePermissionError context.
      throw error;
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}

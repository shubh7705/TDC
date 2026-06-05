import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer, Note } from '@/types';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const useCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const docRef = doc(db, 'customers', customerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Customer;
      }
      throw new Error('Customer not found');
    },
    enabled: !!customerId,
  });
};

export const useNotes = (customerId: string) => {
  return useQuery({
    queryKey: ['notes', customerId],
    queryFn: async () => {
      const q = query(
        collection(db, 'notes'),
        where('customerId', '==', customerId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notes: Note[] = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as Note);
      });
      return notes;
    },
    enabled: !!customerId,
  });
};

export const useAddNote = (customerId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Unauthenticated");
      const newNote = {
        customerId,
        authorId: user.uid,
        authorName: user.name || user.email,
        content,
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, 'notes'), newNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', customerId] });
    },
  });
};

export const useUpdateCustomerSummary = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (aiSummary: string) => {
      const docRef = doc(db, 'customers', customerId);
      await updateDoc(docRef, { aiSummary });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
    },
  });
};

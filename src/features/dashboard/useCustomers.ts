import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer } from '@/types';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const useCustomers = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['customers', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const q = query(
        collection(db, 'customers'),
        where('matchmakerId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const customers: Customer[] = [];
      
      querySnapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      
      // Sort client-side to avoid needing a Firestore composite index
      customers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      return customers;
    },
    enabled: !!user?.uid,
  });
};

export const useDashboardMetrics = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['dashboard-metrics', user?.uid],
    queryFn: async () => {
      if (!user) return null;

      // Mocking some of the complex aggregations for the MVP
      // In production, these should be cloud functions or pre-aggregated
      
      const customersRef = collection(db, 'customers');
      const qTotal = query(customersRef, where('matchmakerId', '==', user.uid));
      const totalSnapshot = await getCountFromServer(qTotal);
      
      const qNeedsMatch = query(customersRef, where('matchmakerId', '==', user.uid), where('status', '==', 'Needs Match'));
      const needsMatchSnapshot = await getCountFromServer(qNeedsMatch);

      const qSuccessful = query(customersRef, where('matchmakerId', '==', user.uid), where('status', '==', 'Successful Match'));
      const successfulSnapshot = await getCountFromServer(qSuccessful);

      // Matches Sent would typically be counted from matchActions
      const actionsRef = collection(db, 'matchActions');
      const qActions = query(actionsRef, where('status', '==', 'Sent'));
      const actionsSnapshot = await getCountFromServer(qActions);
      
      return {
        totalCustomers: totalSnapshot.data().count,
        needsMatch: needsMatchSnapshot.data().count,
        successfulMatches: successfulSnapshot.data().count,
        matchesSent: actionsSnapshot.data().count,
      };
    },
    enabled: !!user?.uid,
  });
};

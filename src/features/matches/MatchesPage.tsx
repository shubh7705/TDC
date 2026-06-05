import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer, MatchScoreBreakdown } from '@/types';
import { calculateMatchScore } from '@/services/matchingEngine';
import { AIService } from '@/services/ai';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Sparkles, Send, Check } from 'lucide-react';
import { toast } from 'sonner';

export const MatchesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateCustomerId = location.state?.customerId;
  // In a real app, this would be selected from a dropdown or passed via routing context
  // For the MVP, we just fetch all matchable customers and compare them
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['all-customers'],
    queryFn: async () => {
      const q = query(collection(db, 'customers'));
      const snapshot = await getDocs(q);
      const data: Customer[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Customer));
      return data;
    }
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Customer | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [isAILoading, setIsAILoading] = useState(false);

  // Example match finding: select passed customer, or first male, and find best matches
  const activeCustomer = customers?.find(c => c.id === stateCustomerId) || selectedCustomer || customers?.find(c => c.status === 'Needs Match') || customers?.[0];
  
  const matchPool = activeCustomer ? (customers?.filter(c => c.id !== activeCustomer.id && c.gender !== activeCustomer.gender) || []) : [];
  
  const rankedMatches = matchPool.map(candidate => {
    const { score, breakdown } = calculateMatchScore(activeCustomer!, candidate);
    return { candidate, score, breakdown };
  }).sort((a, b) => b.score - a.score).slice(0, 10);

  const handleAIExplain = async (match: Customer) => {
    try {
      setIsAILoading(true);
      const explanation = await AIService.generateMatchExplanation(activeCustomer!, match);
      setAiExplanation(explanation);
      setSelectedMatch(match);
      setIsMatchModalOpen(true);
    } catch (error) {
      toast.error('Failed to generate AI explanation');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSendMatch = async () => {
    if (!activeCustomer || !selectedMatch) return;
    try {
      await addDoc(collection(db, 'matchActions'), {
        customerId: activeCustomer.id,
        matchId: selectedMatch.id,
        status: 'Sent',
        timestamp: new Date().toISOString()
      });
      toast.success(`Match recommendation sent to ${activeCustomer.firstName}!`);
      setIsMatchModalOpen(false);
    } catch (error) {
      toast.error('Failed to send match');
    }
  };

  if (isLoading) return <div className="p-8">Loading matches...</div>;
  if (!activeCustomer) return <div className="p-8">No customers found.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif text-navy font-bold tracking-tight">Match Recommendations</h2>
        <p className="text-slate-500 text-sm mt-1">Currently finding matches for: <span className="font-semibold text-navy">{activeCustomer.firstName} {activeCustomer.lastName}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rankedMatches.map(({ candidate, score, breakdown }) => (
          <Card key={candidate.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-serif text-navy">{candidate.firstName} {candidate.lastName}</CardTitle>
                <div className="text-sm text-slate-500">{candidate.age} yrs • {candidate.city}</div>
              </div>
              <div className="flex flex-col items-center justify-center bg-ivory-50 p-2 rounded-lg border border-gold/20">
                <span className="text-xl font-bold text-gold-600">{score}%</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Match</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4 space-y-3">
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Profession</span><span className="font-medium">{candidate.designation}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Education</span><span className="font-medium">{candidate.degree}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Religion</span><span className="font-medium">{candidate.religion}</span></div>
              </div>
              
              <div className="pt-2">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(breakdown).filter(([_, val]) => val > 0).slice(0, 3).map(([key, val]) => (
                    <Badge key={key} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px]">
                      {key} (+{val})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-4 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-slate-600 border-slate-200"
                onClick={() => navigate(`/customer/${candidate.id}`)}
              >
                View
              </Button>
              <Button 
                variant="default" 
                className="flex-1 bg-navy hover:bg-navy-700 text-white gap-2"
                onClick={() => handleAIExplain(candidate)}
                disabled={isAILoading}
              >
                <Sparkles className="w-4 h-4" /> AI Explain
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isMatchModalOpen} onOpenChange={setIsMatchModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-navy flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              AI Match Analysis
            </DialogTitle>
            <DialogDescription>
              Compatibility breakdown for {activeCustomer.firstName} & {selectedMatch?.firstName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm leading-relaxed text-slate-700 font-medium">"{aiExplanation?.summary}"</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-emerald-700 flex items-center gap-1 mb-2">
                  <Check className="w-4 h-4" /> Key Strengths
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                  {aiExplanation?.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-700 flex items-center gap-1 mb-2">
                  Risks & Concerns
                </h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                  {aiExplanation?.concerns?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsMatchModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-gold hover:bg-gold-600 text-navy font-medium gap-2"
              onClick={handleSendMatch}
            >
              <Send className="w-4 h-4" /> Send Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

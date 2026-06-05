import React, { useState } from 'react';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { runSeed } from '@/lib/seed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const user = useAuthStore(state => state.user);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!user) return;
    try {
      setIsSeeding(true);
      await runSeed(user.uid);
      toast.success('Seed data generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate seed data.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-serif text-navy font-bold">Settings</h2>
      
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-navy">Developer Tools</CardTitle>
          <CardDescription>Actions to manage your application data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-lg">
            <div>
              <h4 className="font-medium text-navy">Generate Seed Data</h4>
              <p className="text-sm text-slate-500 mt-1">
                Populates the database with 20 active customers and 100 match pool profiles. Only runs if database is empty.
              </p>
            </div>
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              className="bg-navy hover:bg-navy-700 text-white"
            >
              {isSeeding ? 'Seeding...' : 'Run Seed Script'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from './useCustomer';
import { NotesSection } from './NotesSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Briefcase, GraduationCap, Users, Heart, MapPin, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const CustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(id || '');

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-red-500">Customer not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full">
            <ArrowLeft className="w-5 h-5 text-navy" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-navy">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {customer.city}, {customer.country}</span>
              <span>•</span>
              <span>{customer.age} yrs</span>
              <span>•</span>
              <span>{customer.religion}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-100 text-slate-700 font-medium px-3 py-1">
            {customer.status}
          </Badge>
          <Button 
            className="bg-gold hover:bg-gold-600 text-navy font-medium shadow-sm"
            onClick={() => navigate('/matches', { state: { customerId: customer.id } })}
          >
            Find Matches
          </Button>
        </div>
      </div>

      {/* AI Summary */}
      {customer.aiSummary && (
        <Card className="bg-gradient-to-r from-ivory-50 to-gold-50 border-gold-200 shadow-sm">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 bg-white rounded-full shadow-sm mt-1">
              <Sparkles className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy mb-1">AI Profile Summary</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {customer.aiSummary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start bg-slate-100/50 p-1 rounded-lg">
              <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm">Personal & Contact</TabsTrigger>
              <TabsTrigger value="career" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm">Education & Career</TabsTrigger>
              <TabsTrigger value="family" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm">Family & Culture</TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:shadow-sm">Partner Preferences</TabsTrigger>
            </TabsList>
            
            {/* Personal Tab */}
            <TabsContent value="personal" className="mt-4 space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Full Name" value={`${customer.firstName} ${customer.lastName}`} />
                  <DetailItem label="Gender" value={customer.gender} />
                  <DetailItem label="Date of Birth" value={format(new Date(customer.dob), 'MMMM d, yyyy')} />
                  <DetailItem label="Age" value={`${customer.age} Years`} />
                  <DetailItem label="Height" value={`${customer.height} cm`} />
                  <DetailItem label="Weight" value={`${customer.weight} kg`} />
                  <DetailItem label="Diet" value={customer.diet} />
                  <DetailItem label="Smoking / Drinking" value={`${customer.smoking} / ${customer.drinking}`} />
                  <DetailItem label="Fitness" value={customer.fitnessLevel} />
                  <DetailItem label="Hobbies" value={customer.hobbies.join(', ')} />
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Email" value={customer.email} />
                  <DetailItem label="Phone" value={customer.phone} />
                  <DetailItem label="Location" value={`${customer.city}, ${customer.country}`} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Career Tab */}
            <TabsContent value="career" className="mt-4 space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" /> Professional
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Current Company" value={customer.currentCompany} />
                  <DetailItem label="Designation" value={customer.designation} />
                  <DetailItem label="Annual Income" value={`₹${(customer.income / 100000).toFixed(1)} Lakhs`} />
                  <DetailItem label="Industry" value={customer.industry} />
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-slate-400" /> Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Degree" value={customer.degree} />
                  <DetailItem label="Undergraduate College" value={customer.undergraduateCollege} />
                  <DetailItem label="Postgraduate Degree" value={customer.postgraduateDegree || 'N/A'} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Family Tab */}
            <TabsContent value="family" className="mt-4 space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" /> Family Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Family Type" value={customer.familyType} />
                  <DetailItem label="Family Values" value={customer.familyValues} />
                  <DetailItem label="Siblings" value={customer.siblings.toString()} />
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif">Cultural</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Religion" value={customer.religion} />
                  <DetailItem label="Caste" value={customer.caste || 'N/A'} />
                  <DetailItem label="Mother Tongue" value={customer.motherTongue} />
                  <DetailItem label="Languages Known" value={customer.languagesKnown.join(', ')} />
                  <DetailItem label="Manglik Status" value={customer.manglik} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="mt-4 space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-serif flex items-center gap-2">
                    <Heart className="w-4 h-4 text-slate-400" /> Partner Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <DetailItem label="Age Range" value={`${customer.partnerAgeRange[0]} - ${customer.partnerAgeRange[1]} yrs`} />
                  <DetailItem label="Height Range" value={`${customer.partnerHeightRange[0]} - ${customer.partnerHeightRange[1]} cm`} />
                  <DetailItem label="Preferred Religion" value={customer.partnerReligion.join(', ')} />
                  <DetailItem label="Preferred Education" value={customer.partnerEducation.join(', ')} />
                  <div className="col-span-2">
                    <DetailItem label="Preferred Cities" value={customer.partnerCities.join(', ')} />
                  </div>
                </CardContent>
                <Separator className="my-4" />
                <CardContent className="grid grid-cols-3 gap-y-4 gap-x-8 text-sm pt-0">
                  <DetailItem label="Want Kids" value={customer.wantKids} />
                  <DetailItem label="Open to Relocate" value={customer.openToRelocate ? 'Yes' : 'No'} />
                  <DetailItem label="Open to Pets" value={customer.openToPets ? 'Yes' : 'No'} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Notes & Actions */}
        <div className="space-y-6">
          <div className="h-[500px]">
             <NotesSection customerId={customer.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</span>
    <span className="block font-medium text-slate-800">{value}</span>
  </div>
);

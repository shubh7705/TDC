import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers, useDashboardMetrics } from './useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, HeartPulse, CheckCircle2, Send, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: customers, isLoading: isCustomersLoading } = useCustomers();
  const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredCustomers = customers?.filter((customer) => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Needs Match': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Match Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Meeting Scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Successful Match': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Feedback Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Profile Review': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Verified': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-navy font-bold tracking-tight">Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your active portfolio and recent matches.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {isMetricsLoading ? '-' : metrics?.totalCustomers || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Active in portfolio</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Needs Match</CardTitle>
            <HeartPulse className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {isMetricsLoading ? '-' : metrics?.needsMatch || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Matches Sent</CardTitle>
            <Send className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {isMetricsLoading ? '-' : metrics?.matchesSent || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Awaiting feedback</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Successful Matches</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {isMetricsLoading ? '-' : metrics?.successfulMatches || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Total to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <CardTitle className="text-lg font-serif text-navy">Assigned Customers</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, city..."
                className="pl-8 w-[250px] bg-ivory-50 border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-ivory-50 border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Filter by Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Needs Match">Needs Match</SelectItem>
                <SelectItem value="Match Sent">Match Sent</SelectItem>
                <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Profile Review">Profile Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Age</TableHead>
                <TableHead className="font-medium">City</TableHead>
                <TableHead className="font-medium">Religion</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Last Updated</TableHead>
                <TableHead className="text-right font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCustomersLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers?.map((customer) => (
                  <TableRow 
                    key={customer.id} 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/customer/${customer.id}`)}
                  >
                    <TableCell className="font-medium text-navy">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.age}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.religion}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(customer.status)} font-normal`}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {customer.updatedAt ? format(new Date(customer.updatedAt), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Users, TrendingUp, Calendar } from 'lucide-react';
import { waitlistService, WaitlistEntry } from '@/services/waitlistService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminWaitlist: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    const entries = waitlistService.getWaitlist();
    const statistics = waitlistService.getStats();
    setWaitlist(entries);
    setStats(statistics);
  };

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    if (password === 'pharmassess2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleExportCSV = () => {
    const csv = waitlistService.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmassess-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter password to view waitlist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PharmAssess Waitlist</h1>
            <p className="text-gray-600">Manage and track signups</p>
          </div>
          <Button onClick={handleExportCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-gray-600">Total Signups</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.weeklySignups}</p>
                    <p className="text-gray-600">This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.recentSignups}</p>
                    <p className="text-gray-600">Last 30 Days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Top Province</p>
                  <p className="text-gray-600">
                    {Object.entries(stats.provinceBreakdown).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Daily Signups (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.dailySignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="signups" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signups by Province</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(stats.provinceBreakdown).map(([province, count]) => ({ province, count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="province" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Waitlist Table */}
        <Card>
          <CardHeader>
            <CardTitle>Waitlist Entries</CardTitle>
            <CardDescription>
              {waitlist.length} total entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Pharmacy</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Signup Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlist.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">#{entry.position}</TableCell>
                      <TableCell>{entry.name}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.pharmacyName}</TableCell>
                      <TableCell>{entry.province}</TableCell>
                      <TableCell>{entry.phone || '-'}</TableCell>
                      <TableCell>{new Date(entry.signupDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWaitlist;

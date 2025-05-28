
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Users, TrendingUp, Calendar, Star, MapPin, Target, Mail } from 'lucide-react';
import { waitlistService, WaitlistEntry } from '@/services/waitlistService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import { Link } from 'react-router-dom';

const AdminWaitlist: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    const entries = waitlistService.getWaitlist();
    const statistics = waitlistService.getStats();
    const analyticsData = waitlistService.getAnalytics();
    setWaitlist(entries);
    setStats(statistics);
    setAnalytics(analyticsData);
  };

  const handleLogin = () => {
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

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLeadScoreLabel = (score: number) => {
    if (score >= 80) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PharmAssess Waitlist</h1>
            <p className="text-gray-600">Manage and track signups</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/admin/emails">
              <Button variant="outline" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Templates</span>
              </Button>
            </Link>
            <Button onClick={handleExportCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="leads">Lead Scoring</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
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
                    <div className="flex items-center space-x-2">
                      <Star className="h-8 w-8 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.averageLeadScore.toFixed(0) || 0}
                        </p>
                        <p className="text-gray-600">Avg Lead Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </TabsContent>

          <TabsContent value="analytics">
            {analytics && (
              <div className="space-y-6">
                {/* Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>Track user journey from awareness to high intent</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={Object.entries(analytics.conversionFunnel).map(([stage, count]) => ({ stage, count }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Geographic Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(analytics.provinceDistribution).map(([province, count]) => ({ 
                              name: province, 
                              value: count 
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(analytics.provinceDistribution).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Lead Score Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lead Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={Object.entries(analytics.leadScoreRanges).map(([range, count]) => ({ 
                              name: range, 
                              value: count 
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(analytics.leadScoreRanges).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#22C55E', '#F59E0B', '#EF4444'][index]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Size Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Market Size Analysis</CardTitle>
                    <CardDescription>Estimated market potential and penetration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {analytics.marketSize.totalAddressableMarket.toLocaleString()}
                        </p>
                        <p className="text-gray-600">Total Pharmacies</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {analytics.marketSize.currentPenetration.toFixed(2)}%
                        </p>
                        <p className="text-gray-600">Current Penetration</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-600">
                          ${(analytics.marketSize.estimatedRevenue / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-gray-600">Estimated Annual Revenue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads">
            {analytics && (
              <div className="space-y-6">
                {/* Top Segments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Segments</CardTitle>
                    <CardDescription>Most common waitlist segments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topSegments.map((segment: any, index: number) => (
                        <div key={segment.segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${COLORS[index % COLORS.length]} bg-opacity-80`}></div>
                            <span className="font-medium">{segment.segment}</span>
                          </div>
                          <Badge variant="secondary">{segment.count} members</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* High Priority Leads */}
                <Card>
                  <CardHeader>
                    <CardTitle>High Priority Leads (Score 80+)</CardTitle>
                    <CardDescription>Your most valuable prospects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Pharmacy</TableHead>
                            <TableHead>Province</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Segments</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {waitlist
                            .filter(entry => entry.leadScore >= 80)
                            .sort((a, b) => b.leadScore - a.leadScore)
                            .slice(0, 10)
                            .map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell className="font-medium">{entry.name}</TableCell>
                                <TableCell>{entry.pharmacyName}</TableCell>
                                <TableCell>{entry.province}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${getLeadScoreColor(entry.leadScore)}`}></div>
                                    <span className="font-bold">{entry.leadScore}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {entry.segments.map((segment, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {segment}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="waitlist">
            {/* Waitlist Table */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Waitlist</CardTitle>
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
                        <TableHead>Lead Score</TableHead>
                        <TableHead>Segments</TableHead>
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
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${getLeadScoreColor(entry.leadScore)}`}></div>
                              <span className="font-medium">{entry.leadScore}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getLeadScoreColor(entry.leadScore)} text-white border-0`}
                              >
                                {getLeadScoreLabel(entry.leadScore)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {entry.segments.map((segment, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {segment}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(entry.signupDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminWaitlist;

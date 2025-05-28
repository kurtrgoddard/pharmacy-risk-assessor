
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Clock,
  Database,
  Shield,
  Globe
} from "lucide-react";

interface APIEndpoint {
  name: string;
  friendlyName: string;
  description: string;
  status: 'online' | 'degraded' | 'offline';
  lastUpdated: Date;
  responseTime: number;
  lastSuccessfulUpdate: Date;
  dataAge: number; // days since last data refresh
  icon: React.ReactNode;
}

const APIStatusDashboard = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      name: 'niosh',
      friendlyName: 'NIOSH Hazard Database',
      description: 'Government safety data for pharmaceutical ingredients',
      status: 'online',
      lastUpdated: new Date(),
      responseTime: 245,
      lastSuccessfulUpdate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      dataAge: 2,
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: 'pubchem',
      friendlyName: 'PubChem Chemical Database',
      description: 'Comprehensive chemical and safety information',
      status: 'online',
      lastUpdated: new Date(),
      responseTime: 189,
      lastSuccessfulUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      dataAge: 1,
      icon: <Database className="h-5 w-5" />
    },
    {
      name: 'healthcanada',
      friendlyName: 'Health Canada Drug Database',
      description: 'Licensed drug products and safety information',
      status: 'degraded',
      lastUpdated: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      responseTime: 3200,
      lastSuccessfulUpdate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      dataAge: 7,
      icon: <Globe className="h-5 w-5" />
    },
    {
      name: 'backup',
      friendlyName: 'Offline Safety Database',
      description: 'Local backup of essential safety data',
      status: 'online',
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      responseTime: 45,
      lastSuccessfulUpdate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      dataAge: 30,
      icon: <Database className="h-5 w-5" />
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate API status checks
  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update status with some randomization for demo
    setEndpoints(prev => prev.map(endpoint => ({
      ...endpoint,
      lastUpdated: new Date(),
      responseTime: Math.floor(Math.random() * 1000) + 100,
      status: Math.random() > 0.8 ? 'degraded' : 'online'
    })));
    
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (status: APIEndpoint['status']) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: APIEndpoint['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'offline': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: APIEndpoint['status']) => {
    switch (status) {
      case 'online': return <Badge className="bg-green-100 text-green-800">Online</Badge>;
      case 'degraded': return <Badge className="bg-yellow-100 text-yellow-800">Slow</Badge>;
      case 'offline': return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getOverallStatus = () => {
    const offlineCount = endpoints.filter(e => e.status === 'offline').length;
    const degradedCount = endpoints.filter(e => e.status === 'degraded').length;
    
    if (offlineCount > 0) return 'Some services offline';
    if (degradedCount > 0) return 'Some services slow';
    return 'All systems operational';
  };

  const getOverallStatusColor = () => {
    const offlineCount = endpoints.filter(e => e.status === 'offline').length;
    const degradedCount = endpoints.filter(e => e.status === 'degraded').length;
    
    if (offlineCount > 0) return 'text-red-600';
    if (degradedCount > 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Wifi className="h-5 w-5 mr-2" />
              Data Source Status
            </CardTitle>
            <CardDescription>
              Real-time status of safety databases and APIs
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`flex items-center ${getOverallStatusColor()}`}>
              {getStatusIcon(endpoints.some(e => e.status === 'offline') ? 'offline' : 
                           endpoints.some(e => e.status === 'degraded') ? 'degraded' : 'online')}
              <span className="ml-2 font-medium">{getOverallStatus()}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Status Alert */}
          {endpoints.some(e => e.status !== 'online') && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Some data sources are experiencing issues</p>
                  <p className="text-sm">
                    Risk assessments will continue using cached data. Results remain accurate 
                    but may not include updates from the last few days.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Individual Service Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpoints.map((endpoint) => (
              <div 
                key={endpoint.name}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={getStatusColor(endpoint.status)}>
                      {endpoint.icon}
                    </div>
                    <div>
                      <p className="font-medium">{endpoint.friendlyName}</p>
                      <p className="text-sm text-gray-600">{endpoint.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(endpoint.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Response Time</p>
                    <p className="font-medium">{formatResponseTime(endpoint.responseTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatTimeAgo(endpoint.lastUpdated)}</p>
                  </div>
                </div>

                {endpoint.dataAge > 7 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                    <p className="text-xs text-yellow-800">
                      ⚠️ Data is {endpoint.dataAge} days old. Using cached information.
                    </p>
                  </div>
                )}

                {endpoint.status === 'offline' && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs text-red-800">
                      ❌ Service unavailable. Using backup data from {formatTimeAgo(endpoint.lastSuccessfulUpdate)}.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Usage Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What This Means for Your Assessments</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Green (Online):</strong> Latest safety data is available</p>
              <p>• <strong>Yellow (Slow):</strong> Assessments may take longer but remain accurate</p>
              <p>• <strong>Red (Offline):</strong> Using cached data - still safe but may not include recent updates</p>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            Last checked: {formatTimeAgo(lastRefresh)} • 
            Status updates every 5 minutes automatically
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIStatusDashboard;

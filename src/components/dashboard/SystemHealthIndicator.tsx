
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Activity } from 'lucide-react';
import { SystemHealth } from '@/types/api';

interface SystemHealthIndicatorProps {
  health: SystemHealth;
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ health }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'down': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          System Health Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall System Health</span>
            <Badge className={getOverallStatusColor(health.overall)}>
              {health.overall.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(health.apis).map((api) => (
              <div key={api.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(api.status)}
                  <span className="font-medium">{api.name}</span>
                </div>
                <Badge className={getStatusColor(api.status)}>
                  {api.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Cache Performance</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Hit Rate:</span>
                <div className="font-medium">{(health.cache.hitRate * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>
                <div className="font-medium">{(health.cache.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>
              <div>
                <span className="text-gray-600">Items:</span>
                <div className="font-medium">{health.cache.itemCount}</div>
              </div>
              <div>
                <span className="text-gray-600">Oldest:</span>
                <div className="font-medium">{health.cache.oldestItem.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthIndicator;

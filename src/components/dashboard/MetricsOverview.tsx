
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, TrendingUp, Users } from 'lucide-react';

interface MetricsOverviewProps {
  assessmentStats: any;
  userActivity: any;
  operationMetrics: any[];
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  assessmentStats,
  userActivity,
  operationMetrics
}) => {
  const totalApiCalls = operationMetrics.reduce((sum, metric) => sum + metric.totalCalls, 0);
  const avgSuccessRate = operationMetrics.length > 0 
    ? operationMetrics.reduce((sum, metric) => sum + metric.successRate, 0) / operationMetrics.length 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{assessmentStats?.totalAssessments || 0}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Assessment Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(assessmentStats?.averageAssessmentTime || 0)}ms
          </div>
          <p className="text-xs text-muted-foreground">Per assessment</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">API Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(avgSuccessRate * 100).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">All APIs combined</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Actions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{userActivity?.totalActions || 0}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;

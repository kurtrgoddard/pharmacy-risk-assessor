
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface TopIngredientsChartProps {
  userActivity: any;
}

const TopIngredientsChart: React.FC<TopIngredientsChartProps> = ({ userActivity }) => {
  // Extract assessment-related actions and create chart data
  const assessmentActions = userActivity?.mostCommonActions?.filter((action: any) => 
    action.action.includes('assessment') || action.action.includes('ingredient')
  ).slice(0, 10) || [];

  const data = assessmentActions.map((action: any) => ({
    name: action.action.replace('assessment:', '').replace('ingredient:', ''),
    count: action.count
  }));

  const chartConfig = {
    count: {
      label: "Count",
      color: "#3b82f6",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top User Actions</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No user activity data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopIngredientsChart;

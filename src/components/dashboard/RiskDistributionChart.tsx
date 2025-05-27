
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface RiskDistributionChartProps {
  riskDistribution: Record<string, number>;
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ riskDistribution }) => {
  const data = Object.entries(riskDistribution || {}).map(([level, count]) => ({
    name: `Level ${level}`,
    value: count,
    level
  }));

  const COLORS = {
    'A': '#22c55e', // Green for Level A
    'B': '#f59e0b', // Yellow for Level B
    'C': '#ef4444', // Red for Level C
  };

  const chartConfig = {
    value: {
      label: "Assessments",
    },
    'Level A': {
      label: "Level A",
      color: COLORS.A,
    },
    'Level B': {
      label: "Level B", 
      color: COLORS.B,
    },
    'Level C': {
      label: "Level C",
      color: COLORS.C,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.level as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No assessment data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;

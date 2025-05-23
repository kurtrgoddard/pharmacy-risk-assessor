
import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Database, Globe, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataSourceIndicatorProps {
  source: string;
  confidence: number;
  lastUpdated?: Date;
  warnings?: string[];
}

export function DataSourceIndicator({ 
  source, 
  confidence, 
  lastUpdated,
  warnings 
}: DataSourceIndicatorProps) {
  // Determine confidence level
  const getConfidenceLevel = () => {
    if (confidence >= 0.8) return { label: 'High', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (confidence >= 0.5) return { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { label: 'Low', color: 'text-red-600', bgColor: 'bg-red-50' };
  };

  const confidenceLevel = getConfidenceLevel();

  // Get appropriate icon
  const getIcon = () => {
    if (confidence >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.5) return <AlertCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  // Get source icon
  const getSourceIcon = () => {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('pubchem')) return <Database className="w-4 h-4" />;
    if (lowerSource.includes('niosh')) return <FileText className="w-4 h-4" />;
    if (lowerSource.includes('dailymed')) return <FileText className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Source Badge */}
        <Badge variant="outline" className="flex items-center gap-1">
          {getSourceIcon()}
          <span className="text-xs font-medium">{source}</span>
        </Badge>

        {/* Confidence Indicator */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${confidenceLevel.bgColor}`}>
                <span className={confidenceLevel.color}>{getIcon()}</span>
                <span className={`text-xs font-medium ${confidenceLevel.color}`}>
                  {Math.round(confidence * 100)}% confidence
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Data reliability: {confidenceLevel.label}
                {confidence < 0.5 && (
                  <span className="block text-xs mt-1 text-yellow-600">
                    Manual verification recommended
                  </span>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Last Updated */}
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated {formatDate(new Date(lastUpdated))}
          </span>
        )}
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="flex flex-col gap-1">
          {warnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact version for inline use
export function DataSourceBadge({ source, confidence }: { source: string; confidence: number }) {
  const getColor = () => {
    if (confidence >= 0.8) return 'default';
    if (confidence >= 0.5) return 'secondary';
    return 'destructive';
  };

  return (
    <Badge variant={getColor() as any} className="text-xs">
      {source} • {Math.round(confidence * 100)}%
    </Badge>
  );
}

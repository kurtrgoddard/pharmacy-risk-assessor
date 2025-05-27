
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  tooltip?: string;
  helpText?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  autoComplete?: string;
  pattern?: string;
  minLength?: number;
}

export const EnhancedFormField: React.FC<EnhancedFormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required = false,
  tooltip,
  helpText,
  error,
  success = false,
  loading = false,
  type = 'text',
  autoComplete = 'off',
  pattern,
  minLength
}) => {
  const hasError = !!error;
  const showSuccess = success && !hasError && value.length > 0;

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label 
            htmlFor={id} 
            className={cn(
              "text-sm font-medium",
              hasError && "text-red-600",
              showSuccess && "text-green-600"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          
          {tooltip && (
            <Tooltip>
              <TooltipTrigger type="button">
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="relative">
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            autoComplete={autoComplete}
            pattern={pattern}
            minLength={minLength}
            className={cn(
              "transition-all duration-200",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
              showSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500",
              loading && "opacity-70"
            )}
            aria-describedby={
              hasError ? `${id}-error` : 
              helpText ? `${id}-help` : undefined
            }
            aria-invalid={hasError}
            disabled={loading}
          />
          
          {(showSuccess || hasError) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {showSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
              {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          )}
        </div>

        {maxLength && (
          <div className="text-xs text-gray-500 text-right">
            {value.length}/{maxLength}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="py-2" id={`${id}-error`}>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {helpText && !error && (
          <p className="text-xs text-gray-600" id={`${id}-help`}>
            {helpText}
          </p>
        )}
      </div>
    </TooltipProvider>
  );
};

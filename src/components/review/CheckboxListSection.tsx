
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxListSectionProps {
  title: string;
  options: string[];
  selectedValues: string[];
  fieldName: string;
  isEditing: boolean;
  onCheckboxListChange: (field: string, value: string, checked: boolean) => void;
}

const CheckboxListSection: React.FC<CheckboxListSectionProps> = ({
  title,
  options,
  selectedValues,
  fieldName,
  isEditing,
  onCheckboxListChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${fieldName}-${option}`}
            checked={selectedValues.includes(option)}
            onCheckedChange={(checked) => onCheckboxListChange(fieldName, option, !!checked)}
            disabled={!isEditing}
          />
          <label 
            htmlFor={`${fieldName}-${option}`} 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxListSection;

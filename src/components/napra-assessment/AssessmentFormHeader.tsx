
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AssessmentFormHeaderProps {
  control: any;
}

const AssessmentFormHeader: React.FC<AssessmentFormHeaderProps> = ({
  control
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="pharmacyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pharmacy Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter pharmacy name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="assessorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessor Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter assessor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="assessmentDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assessment Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="preparationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preparation Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter preparation name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AssessmentFormHeader;

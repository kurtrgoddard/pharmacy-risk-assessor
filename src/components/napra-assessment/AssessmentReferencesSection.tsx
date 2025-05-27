
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface AssessmentReferencesSectionProps {
  control: any;
}

const AssessmentReferencesSection: React.FC<AssessmentReferencesSectionProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="references"
      render={({ field }) => (
        <FormItem>
          <FormLabel>References</FormLabel>
          <FormControl>
            <Textarea
              placeholder="List any references used for the assessment"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AssessmentReferencesSection;

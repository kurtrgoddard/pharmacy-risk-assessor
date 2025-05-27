
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AssessmentFormSectionsProps {
  control: any;
}

const AssessmentFormSections: React.FC<AssessmentFormSectionsProps> = ({ control }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Ingredient Details
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List of Ingredients</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List all ingredients and their concentrations"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-2">
        <AccordionTrigger>
          Process Description
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={control}
            name="processDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Process Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the preparation process step by step"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Equipment and Environment
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={control}
            name="equipmentUsed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Used</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List all equipment used during preparation"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="environmentalControls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environmental Controls</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe environmental controls (e.g., ISO class)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-4">
        <AccordionTrigger>
          Quality and Stability
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={control}
            name="stabilityData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stability Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Summarize stability data for the preparation"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="sterilizationMethods"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sterilization Methods</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe sterilization methods used, if applicable"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="qualityControlMeasures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quality Control Measures</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List quality control measures implemented"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-5">
        <AccordionTrigger>
          Packaging and Storage
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={control}
            name="packagingMaterials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Packaging Materials</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe packaging materials used"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="labelingPractices"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Labeling Practices</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe labeling practices followed"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="storageConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Specify storage conditions required"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="item-6">
        <AccordionTrigger>
          Risk Assessment and Mitigation
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={control}
            name="riskLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a risk level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="mitigationStrategies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mitigation Strategies</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe strategies to mitigate identified risks"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="residualRisk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residual Risk</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the residual risk after mitigation"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AssessmentFormSections;

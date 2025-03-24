
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowConsiderations {
  uninterruptedWorkflow: {
    status: boolean;
    measures?: string;
  };
  microbialContaminationRisk: boolean;
  crossContaminationRisk: boolean;
}

interface WorkflowConsiderationsSectionProps {
  workflowConsiderations: WorkflowConsiderations;
  isEditing: boolean;
  onNestedObjectChange: (objectPath: string, field: string, value: any) => void;
}

const WorkflowConsiderationsSection: React.FC<WorkflowConsiderationsSectionProps> = ({
  workflowConsiderations,
  isEditing,
  onNestedObjectChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Workflow uninterrupted</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={workflowConsiderations.uninterruptedWorkflow.status}
            onCheckedChange={(checked) => onNestedObjectChange("workflowConsiderations", "uninterruptedWorkflow", { ...workflowConsiderations.uninterruptedWorkflow, status: !!checked })}
            disabled={!isEditing}
            id="workflow-uninterrupted"
          />
          <label htmlFor="workflow-uninterrupted" className="text-sm text-pharmacy-gray">
            Uninterrupted
          </label>
        </div>
        {!workflowConsiderations.uninterruptedWorkflow.status && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-pharmacy-gray mb-1">Measures</label>
            <Textarea
              value={workflowConsiderations.uninterruptedWorkflow.measures || ""}
              onChange={(e) => onNestedObjectChange("workflowConsiderations", "uninterruptedWorkflow", { ...workflowConsiderations.uninterruptedWorkflow, measures: e.target.value })}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk of microbial contamination</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={workflowConsiderations.microbialContaminationRisk}
            onCheckedChange={(checked) => onNestedObjectChange("workflowConsiderations", "microbialContaminationRisk", !!checked)}
            disabled={!isEditing}
            id="microbial-contamination-risk"
          />
          <label htmlFor="microbial-contamination-risk" className="text-sm text-pharmacy-gray">
            Risk Present
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-pharmacy-gray mb-1">Risk of cross-contamination</label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={workflowConsiderations.crossContaminationRisk}
            onCheckedChange={(checked) => onNestedObjectChange("workflowConsiderations", "crossContaminationRisk", !!checked)}
            disabled={!isEditing}
            id="cross-contamination-risk"
          />
          <label htmlFor="cross-contamination-risk" className="text-sm text-pharmacy-gray">
            Risk Present
          </label>
        </div>
      </div>
    </div>
  );
};

export default WorkflowConsiderationsSection;

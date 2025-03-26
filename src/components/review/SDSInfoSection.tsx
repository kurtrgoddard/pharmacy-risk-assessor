
import React, { useState, useEffect } from "react";
import { AlertTriangle, Info, Shield, ShieldAlert, ShieldCheck, FileDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SDSData } from "@/utils/mediscaAPI";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface SDSInfoSectionProps {
  ingredientName: string;
  sdsData: SDSData | null;
  isLoading: boolean;
  onViewSds?: () => void;
}

const SDSInfoSection: React.FC<SDSInfoSectionProps> = ({
  ingredientName,
  sdsData,
  isLoading,
  onViewSds
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  useEffect(() => {
    // Auto-expand if hazardous
    if (sdsData && isHazardous(sdsData)) {
      setExpanded(true);
    }
  }, [sdsData]);
  
  const isHazardous = (data: SDSData): boolean => {
    const nonHazardousGhs = data.hazardClassification.ghs.some(h => 
      h.toLowerCase().includes("not classified") || h.toLowerCase().includes("non-hazardous")
    );
    
    const nonHazardousWhmis = data.hazardClassification.whmis.some(h => 
      h.toLowerCase().includes("not classified") || h.toLowerCase().includes("non-hazardous")
    );
    
    return !(nonHazardousGhs && nonHazardousWhmis);
  };
  
  const getHazardBadge = (data: SDSData) => {
    if (!data) return null;
    
    if (data.hazardClassification.ghs.some(h => 
      h.toLowerCase().includes("carcinogen") || 
      h.toLowerCase().includes("mutagen") ||
      h.toLowerCase().includes("reproductive")
    )) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <ShieldAlert className="w-3 h-3 mr-1" />
          High Hazard
        </Badge>
      );
    }
    
    if (!isHazardous(data)) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Non-Hazardous
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Shield className="w-3 h-3 mr-1" />
        Moderate Hazard
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <div className="mt-4 border rounded-md p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  if (!sdsData) {
    return (
      <div className="mt-4 border rounded-md p-4 bg-gray-50">
        <div className="flex items-center text-sm text-gray-600">
          <Info className="w-4 h-4 mr-2 text-blue-500" />
          <span>SDS information not available for {ingredientName}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div 
        className={`p-4 ${isHazardous(sdsData) ? 'bg-yellow-50' : 'bg-green-50'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <FileText className={`w-4 h-4 mr-2 ${isHazardous(sdsData) ? 'text-yellow-600' : 'text-green-600'}`} />
            <span className="font-medium text-sm">Medisca SDS Information</span>
            {getHazardBadge(sdsData)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewSds) onViewSds();
            }}
            className="text-xs"
          >
            <FileDown className="w-3 h-3 mr-1" />
            View SDS
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t bg-white">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hazards">
              <AccordionTrigger className="text-sm font-medium">
                Hazard Classification
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4 text-sm">
                  <div>
                    <h4 className="font-medium text-xs uppercase text-gray-500 mb-1">GHS Classification</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {sdsData.hazardClassification.ghs.map((hazard, index) => (
                        <li key={index} className="text-gray-700">{hazard}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-xs uppercase text-gray-500 mb-1">WHMIS Classification</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {sdsData.hazardClassification.whmis.map((hazard, index) => (
                        <li key={index} className="text-gray-700">{hazard}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ppe">
              <AccordionTrigger className="text-sm font-medium">
                Recommended PPE
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-4 text-sm">
                  <p><span className="font-medium">Gloves:</span> {sdsData.recommendedPPE.gloves}</p>
                  <p><span className="font-medium">Respiratory:</span> {sdsData.recommendedPPE.respiratoryProtection}</p>
                  <p><span className="font-medium">Eye Protection:</span> {sdsData.recommendedPPE.eyeProtection}</p>
                  <p><span className="font-medium">Body Protection:</span> {sdsData.recommendedPPE.bodyProtection}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="risks">
              <AccordionTrigger className="text-sm font-medium">
                Exposure Risks
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  {sdsData.exposureRisks.map((risk, index) => (
                    <li key={index} className="text-gray-700">{risk}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="precautions">
              <AccordionTrigger className="text-sm font-medium">
                Handling Precautions
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm">
                  {sdsData.handlingPrecautions.map((precaution, index) => (
                    <li key={index} className="text-gray-700">{precaution}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default SDSInfoSection;

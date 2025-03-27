
import React, { useState, useEffect } from "react";
import { AlertTriangle, Info, Shield, ShieldAlert, ShieldCheck, FileDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SDSData, openSdsDocument } from "@/utils/mediscaAPI";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
    // Auto-expand if hazardous or is a narcotic/powder
    if (sdsData && (isHazardous(sdsData) || isPowderHazard(sdsData))) {
      setExpanded(true);
    }
  }, [sdsData, ingredientName]);
  
  const isHazardous = (data: SDSData): boolean => {
    const nonHazardousGhs = data.hazardClassification.ghs.some(h => 
      h.toLowerCase().includes("not classified") || h.toLowerCase().includes("non-hazardous")
    );
    
    const nonHazardousWhmis = data.hazardClassification.whmis.some(h => 
      h.toLowerCase().includes("not classified") || h.toLowerCase().includes("non-hazardous")
    );
    
    return !(nonHazardousGhs && nonHazardousWhmis);
  };
  
  const isHighHazard = (data: SDSData): boolean => {
    if (!data) return false;
    
    return data.hazardClassification.ghs.some(h => 
      h.toLowerCase().includes("carcinogen") || 
      h.toLowerCase().includes("mutagen") ||
      h.toLowerCase().includes("reproductive")
    );
  };
  
  const isPowderHazard = (data: SDSData): boolean => {
    if (!data) return false;
    
    // Check if the SDS mentions powder form and has any hazard
    return (data.physicalForm?.toLowerCase().includes("powder") || 
           data.physicalForm?.toLowerCase().includes("dust") ||
           data.physicalForm?.toLowerCase().includes("solid") ||
           data.physicalForm?.toLowerCase().includes("crystalline") ||
           data.physicalForm?.toLowerCase().includes("granular"));
  };
  
  const isNarcotic = (name: string): boolean => {
    const narcoticKeywords = [
      "ketamine", "codeine", "morphine", "fentanyl", 
      "hydrocodone", "oxycodone", "hydromorphone", "methadone",
      "buprenorphine", "tramadol"
    ];
    
    // Baclofen should NOT be classified as a narcotic - fixing this
    return narcoticKeywords.some(keyword => 
      name.toLowerCase().includes(keyword)
    );
  };
  
  const getHazardBadge = (data: SDSData) => {
    if (!data) return null;
    
    if (isHighHazard(data)) {
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
  
  const getNarcoticBadge = (name: string) => {
    if (isNarcotic(name)) {
      return (
        <Badge className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Narcotic/Controlled
        </Badge>
      );
    }
    return null;
  };
  
  const handleViewSds = () => {
    if (onViewSds) {
      onViewSds();
    } else {
      // Use the updated function to open SDS in a new tab
      try {
        openSdsDocument(ingredientName);
        console.log(`Opening SDS for ${ingredientName}`);
      } catch (error) {
        console.error(`Error opening SDS for ${ingredientName}:`, error);
        toast.error("Could not retrieve SDS at this time. Please try again later.");
      }
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Info className="w-4 h-4 mr-2 text-blue-500" />
            <span>SDS information currently unavailable for {ingredientName}</span>
            {isNarcotic(ingredientName) && getNarcoticBadge(ingredientName)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewSds}
            className="text-xs"
          >
            <FileDown className="w-3 h-3 mr-1" />
            Try View SDS
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <div 
        className={`p-4 ${isPowderHazard(sdsData) ? 'bg-orange-50' : isHazardous(sdsData) ? 'bg-yellow-50' : 'bg-green-50'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center cursor-pointer">
          <div className="flex items-center">
            <FileText className={`w-4 h-4 mr-2 ${isPowderHazard(sdsData) ? 'text-orange-600' : isHazardous(sdsData) ? 'text-yellow-600' : 'text-green-600'}`} />
            <span className="font-medium text-sm">Safety Data Information</span>
            {getHazardBadge(sdsData)}
            
            {isPowderHazard(sdsData) && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Powder Hazard
              </Badge>
            )}
            
            {isNarcotic(ingredientName) && getNarcoticBadge(ingredientName)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSds();
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
            {sdsData.physicalForm && (
              <div className="mb-3 px-4 py-2 bg-gray-50 rounded-md text-sm">
                <span className="font-medium">Physical Form:</span> {sdsData.physicalForm}
                {isPowderHazard(sdsData) && (
                  <div className="mt-1 text-orange-700 text-xs font-medium">
                    ⚠️ Powder form requires additional precautions including powder containment hood and proper ventilation
                  </div>
                )}
                {isNarcotic(ingredientName) && (
                  <div className="mt-1 text-purple-700 text-xs font-medium">
                    ⚠️ Narcotic/controlled substance requiring special handling and security measures
                  </div>
                )}
              </div>
            )}
            
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

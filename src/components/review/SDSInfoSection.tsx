
import React, { useState, useEffect } from "react";
import { Info, FileDown, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SDSData } from "@/utils/mediscaAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { openSdsDocument, getReliableChemicalSearchUrls } from "@/utils/sdsUrlService";
import { SDSBadges } from "./sds/SDSBadges";
import { SDSContent } from "./sds/SDSContent";

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
  
  const isPowderHazard = (data: SDSData): boolean => {
    if (!data) return false;
    
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
      "buprenorphine", "tramadol", "opioid", "diazepam",
      "lorazepam", "alprazolam", "clonazepam", "midazolam"
    ];
    
    if (name.toLowerCase() === "baclofen") return false;
    
    return narcoticKeywords.some(keyword => 
      name.toLowerCase().includes(keyword)
    );
  };
  
  const handleViewSds = () => {
    if (onViewSds) {
      onViewSds();
    } else {
      try {
        openSdsDocument(ingredientName);
        console.log(`Opening reliable chemical databases for ${ingredientName}`);
      } catch (error) {
        console.error(`Error opening SDS sources for ${ingredientName}:`, error);
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
            <SDSBadges sdsData={null} ingredientName={ingredientName} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewSds}
            className="text-xs"
            title="Search reliable chemical databases (PubChem, ChemSpider, EPA) for SDS information"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Find SDS
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
            <SDSBadges sdsData={sdsData} ingredientName={ingredientName} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSds();
            }}
            className="text-xs"
            title="Search multiple reliable chemical databases for comprehensive SDS information"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Find SDS
          </Button>
        </div>
      </div>

      {expanded && <SDSContent sdsData={sdsData} ingredientName={ingredientName} />}
    </div>
  );
};

export default SDSInfoSection;

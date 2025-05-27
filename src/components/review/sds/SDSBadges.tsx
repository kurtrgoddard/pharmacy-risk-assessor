
import React from "react";
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SDSData } from "@/utils/mediscaAPI";

interface SDSBadgesProps {
  sdsData: SDSData | null;
  ingredientName: string;
}

export const SDSBadges: React.FC<SDSBadgesProps> = ({ sdsData, ingredientName }) => {
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

  const getPowderBadge = (data: SDSData) => {
    if (isPowderHazard(data)) {
      return (
        <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Powder Hazard
        </Badge>
      );
    }
    return null;
  };

  return (
    <>
      {sdsData && getHazardBadge(sdsData)}
      {sdsData && getPowderBadge(sdsData)}
      {getNarcoticBadge(ingredientName)}
    </>
  );
};

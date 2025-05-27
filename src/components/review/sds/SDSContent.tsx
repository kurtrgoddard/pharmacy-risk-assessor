
import React from "react";
import { Info, AlertTriangle, ExternalLink } from "lucide-react";
import { SDSData } from "@/utils/mediscaAPI";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getReliableChemicalSearchUrls } from "@/utils/sdsUrlService";

interface SDSContentProps {
  sdsData: SDSData;
  ingredientName: string;
}

export const SDSContent: React.FC<SDSContentProps> = ({ sdsData, ingredientName }) => {
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

  const reliableSources = getReliableChemicalSearchUrls(ingredientName);

  return (
    <div className="p-4 border-t bg-white">
      <div className="mb-3 px-4 py-2 bg-blue-50 rounded-md text-sm border border-blue-200">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-medium text-blue-800">Reliable SDS Sources:</span>
            <p className="text-blue-700 text-xs mt-1">
              Access multiple verified chemical databases for comprehensive safety information.
            </p>
            <div className="mt-2 space-y-1">
              {reliableSources.slice(0, 3).map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-blue-600">{source.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(source.url, '_blank', 'noopener,noreferrer')}
                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
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
  );
};

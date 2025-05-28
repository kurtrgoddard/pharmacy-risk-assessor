
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Phone, Mail, ExternalLink, AlertTriangle } from "lucide-react";

interface ProvinceInfo {
  code: string;
  name: string;
  regulatoryBody: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  specificRequirements: string[];
  riskLevelAdjustments: {
    powderForms: boolean;
    hormonalCompounds: boolean;
    cytotoxicCompounds: boolean;
  };
  complianceNotes: string[];
}

const provinceData: Record<string, ProvinceInfo> = {
  ON: {
    code: 'ON',
    name: 'Ontario',
    regulatoryBody: 'Ontario College of Pharmacists (OCP)',
    contactPhone: '416-962-4861',
    contactEmail: 'info@ocpinfo.com',
    website: 'https://www.ocpinfo.com',
    specificRequirements: [
      'Sterile compounding requires specialized facilities',
      'Non-sterile compounding policies must be documented',
      'Staff training records must be maintained',
      'Quality assurance program required'
    ],
    riskLevelAdjustments: {
      powderForms: true,
      hormonalCompounds: true,
      cytotoxicCompounds: true
    },
    complianceNotes: [
      'Compounding must comply with NAPRA guidelines',
      'Facility inspections include compounding areas',
      'Documentation retention: minimum 2 years'
    ]
  },
  BC: {
    code: 'BC',
    name: 'British Columbia',
    regulatoryBody: 'College of Pharmacists of BC (CPBC)',
    contactPhone: '604-733-2440',
    contactEmail: 'info@cpbc.ca',
    website: 'https://www.bcpharmacists.org',
    specificRequirements: [
      'Compounding SOP must be approved by PIC',
      'Environmental monitoring for sterile compounds',
      'Beyond Use Dating protocols required',
      'Patient counseling documentation'
    ],
    riskLevelAdjustments: {
      powderForms: true,
      hormonalCompounds: false,
      cytotoxicCompounds: true
    },
    complianceNotes: [
      'Enhanced requirements for controlled substances',
      'Regular competency assessments required',
      'Incident reporting system mandatory'
    ]
  },
  AB: {
    code: 'AB',
    name: 'Alberta',
    regulatoryBody: 'Alberta College of Pharmacy (ACP)',
    contactPhone: '780-990-0321',
    contactEmail: 'info@abpharmacy.ca',
    website: 'https://abpharmacy.ca',
    specificRequirements: [
      'Compounding certificate required for complex preparations',
      'Batch record documentation mandatory',
      'Equipment calibration records',
      'Adverse event reporting system'
    ],
    riskLevelAdjustments: {
      powderForms: true,
      hormonalCompounds: true,
      cytotoxicCompounds: true
    },
    complianceNotes: [
      'Annual facility inspections include compounding',
      'Continuing education requirements for compounding',
      'Patient safety protocols must be documented'
    ]
  }
  // Add more provinces as needed...
};

interface ProvinceSelectorProps {
  selectedProvince: string | null;
  onProvinceChange: (province: string) => void;
  showComplianceInfo?: boolean;
}

const ProvinceSelector = ({ 
  selectedProvince, 
  onProvinceChange, 
  showComplianceInfo = true 
}: ProvinceSelectorProps) => {
  const [currentProvinceInfo, setCurrentProvinceInfo] = useState<ProvinceInfo | null>(null);

  useEffect(() => {
    if (selectedProvince && provinceData[selectedProvince]) {
      setCurrentProvinceInfo(provinceData[selectedProvince]);
    } else {
      setCurrentProvinceInfo(null);
    }
  }, [selectedProvince]);

  const canadianProvinces = [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'YT', name: 'Yukon' }
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Province/Territory
        </label>
        <Select value={selectedProvince || ''} onValueChange={onProvinceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your province/territory" />
          </SelectTrigger>
          <SelectContent>
            {canadianProvinces.map((province) => (
              <SelectItem key={province.code} value={province.code}>
                <div className="flex items-center justify-between w-full">
                  <span>{province.name}</span>
                  {provinceData[province.code] && (
                    <Badge variant="secondary" className="ml-2">
                      Enhanced Support
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showComplianceInfo && currentProvinceInfo && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              {currentProvinceInfo.name} Compliance Information
            </CardTitle>
            <CardDescription>
              Regulatory requirements specific to {currentProvinceInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Regulatory Body Contact */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Regulatory Contact</h4>
              <div className="space-y-2">
                <p className="font-medium">{currentProvinceInfo.regulatoryBody}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {currentProvinceInfo.contactPhone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {currentProvinceInfo.contactEmail}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>

            {/* Specific Requirements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Compounding Requirements
              </h4>
              <ul className="space-y-1">
                {currentProvinceInfo.specificRequirements.map((req, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Level Adjustments */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Provincial Risk Considerations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg text-center ${
                  currentProvinceInfo.riskLevelAdjustments.powderForms 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className="text-sm font-medium">Powder Forms</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {currentProvinceInfo.riskLevelAdjustments.powderForms 
                      ? 'Enhanced precautions' 
                      : 'Standard precautions'
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  currentProvinceInfo.riskLevelAdjustments.hormonalCompounds 
                    ? 'bg-yellow-50 border border-yellow-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className="text-sm font-medium">Hormonal Compounds</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {currentProvinceInfo.riskLevelAdjustments.hormonalCompounds 
                      ? 'Enhanced precautions' 
                      : 'Standard precautions'
                    }
                  </p>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  currentProvinceInfo.riskLevelAdjustments.cytotoxicCompounds 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className="text-sm font-medium">Cytotoxic Compounds</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {currentProvinceInfo.riskLevelAdjustments.cytotoxicCompounds 
                      ? 'Strict requirements' 
                      : 'Standard precautions'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Notes */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Key Compliance Notes:</p>
                  {currentProvinceInfo.complianceNotes.map((note, index) => (
                    <p key={index} className="text-sm">• {note}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {showComplianceInfo && selectedProvince && !currentProvinceInfo && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Detailed compliance information for this province is being added. 
            Please contact your provincial regulatory body for specific requirements.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProvinceSelector;

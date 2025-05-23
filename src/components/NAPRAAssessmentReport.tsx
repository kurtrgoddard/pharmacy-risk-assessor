
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FilePdf } from "lucide-react";
import { PDFViewer } from "@/components";
import { toast } from "sonner";

interface NAPRAAssessmentReportProps {
  assessment: any;
  onBack: () => void;
}

const NAPRAAssessmentReport: React.FC<NAPRAAssessmentReportProps> = ({
  assessment,
  onBack,
}) => {
  const pdfBlob = "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAxNCAwIFIKPj4KL0V4dEdTdGF0ZSA8PAovR1M3IDcgMCBSCi9HUzggOCAwIFIKPj4KPj4KL0NvbnRlbnRzIFsxNSAwIFJdCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9Dcm9wQm94IFswIDAgNTk1IDg0Ml0KL1JvdGF0ZSAwCj4+CmVuZG9iagoxNSAwIG9iago8PAovTGVuZ3RoIDE2IDAgUgovRmlsdGVyIC9GbGF0ZURlY29kZQo+PgpzdHJlYW0KeJytVluO0zAQvfsUc4OOZzKZx07nCImffrhw4Qt4m3a78bZd2gIXSO1JO2nSohYBhVhyPGM7njn3TryHH0GQIEEgGujtRezdTy6gJbJ+IeToHXoLtIHXy9F0giq1VKiZMCPntVgCdzOMFQ/xK/t2OXqBXkzwggv4hN6L69tlQJhHM1MLagwt6yvfff6aEIhWePxvgXGbf74JhXbKQXiiw5XkFb1oNKv0pVrU9340Bo1fzuAWnCny3cRaF5xvnMA+hI9YLmKzktXiyXw+m82nZb04gMhwCnXVcnYL1MWAccHQxEpMMqJmTKIt02kpFQ3hM6sP60241GoO5xlvnJXe2Lxek+b5Nv88TZfHy6TSoCwvYZlXJ0GmNNguGawkzCoUwpjWp88Y9NhYGnZIfTGG5o6+ra70EZ0bS922NkSmXaqCPrQdsl3YzZZSTcN2kZL+WklOioswf4go6MdPY13J09B7x7JaBy3Cm7zUpCF0WC3dtAguJRV7ke9FvUjrVTpJy+Piyi1p9aNW2G1PvlMO5GQyndp8jvJdb7Qote5Aij6kmj/IQH/SBvA2OYIaNeV89C5Nx5PkdDw7G4/P0rP0RH5Lsmw8HZ+f4vFfS+Ylh+DpZDKeTDHsf5PoI5ajZM94BhMYNAF9lxybE7UOW2IcZKMHg/kDmCt1lGZpmr1+PM1+A41ks7cKZW5kc3RyZWFtCmVuZG9iagoxNiAwIG9iago1MTAKZW5kb2JqCjE0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL1RpbWVzLVJvbWFuCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9UeXBlIC9FeHRHU3RhdGUKL0JNIC9Ob3JtYWwKL0NBIDEKL0xDIDAKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0V4dEdTdGF0ZQovQk0gL05vcm1hbAovY2EgMQo+PgplbmRvYmoKeHJlZgowIDE3CjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMDAwOSAwMDAwMCBuDQowMDAwMDAwMDU3IDAwMDAwIG4NCjAwMDAwMDAxMTQgMDAwMDAgbg0KMDAwMDAwMDMwMCAwMDAwMCBuDQowMDAwMDAwODgwIDAwMDAwIG4NCjAwMDAwMDA5NTEgMDAwMDAgbg0KMDAwMDAwMTA0NSAwMDAwMCBuDQowMDAwMDAxMTA0IDAwMDAwIG4NCjAwMDAwMDAwMDAgMDAwMDAgZg0KMDAwMDAwMDAwMCAwMDAwMCBmDQowMDAwMDAwMDAwIDAwMDAwIGYNCjAwMDAwMDAwMDAgMDAwMDAgZg0KMDAwMDAwMDAwMCAwMDAwMCBmDQowMDAwMDAwOTc5IDAwMDAwIG4NCjAwMDAwMDAyOTkgMDAwMDAgbg0KMDAwMDAwMDg2MCAwMDAwMCBuDQp0cmFpbGVyCjw8Ci9TaXplIDE3Ci9Sb290IDEgMCBSCi9JbmZvIDkgMCBSCj4+CnN0YXJ0eHJlZgoxMTYyCiUlRU9GCg=="; 

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfBlob;
    link.download = `NAPRA_Risk_Assessment_${assessment.compoundName || 'Compound'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Assessment report downloaded");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button variant="outline" onClick={onBack} size="sm" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold text-pharmacy-darkBlue">
            NAPRA Risk Assessment Report
          </h2>
        </div>
        
        <div className="glass-card rounded-xl p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-pharmacy-darkBlue mb-3">Compound Information</h3>
              <p className="text-pharmacy-gray"><strong>Name:</strong> {assessment.compoundName || 'N/A'}</p>
              <p className="text-pharmacy-gray"><strong>DIN:</strong> {assessment.din || 'N/A'}</p>
              <p className="text-pharmacy-gray"><strong>Type:</strong> {assessment.compoundingType || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-pharmacy-darkBlue mb-3">Risk Assessment</h3>
              <p className="text-pharmacy-gray">
                <strong>Risk Level:</strong> <span className={`px-2 py-1 rounded ${
                  assessment.assignedRiskLevel === 'Level C' ? 'bg-red-100 text-red-800' :
                  assessment.assignedRiskLevel === 'Level B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>{assessment.assignedRiskLevel || 'Not Assigned'}</span>
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-pharmacy-darkBlue mb-3">Recommended Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-medium text-pharmacy-gray mb-2">Personal Protective Equipment (PPE)</h4>
                {assessment.recommendedControls.ppe && assessment.recommendedControls.ppe.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {assessment.recommendedControls.ppe.map((item: string, index: number) => (
                      <li key={index} className="text-pharmacy-gray">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-pharmacy-gray">No PPE specified</p>
                )}
              </div>
              
              <div>
                <h4 className="text-md font-medium text-pharmacy-gray mb-2">Engineering Controls</h4>
                {assessment.recommendedControls.engineeringControls && assessment.recommendedControls.engineeringControls.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {assessment.recommendedControls.engineeringControls.map((item: string, index: number) => (
                      <li key={index} className="text-pharmacy-gray">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-pharmacy-gray">No engineering controls specified</p>
                )}
              </div>
            </div>
            
            {assessment.recommendedControls.otherControls && assessment.recommendedControls.otherControls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-pharmacy-gray mb-2">Other Controls</h4>
                <ul className="list-disc list-inside">
                  {assessment.recommendedControls.otherControls.map((item: string, index: number) => (
                    <li key={index} className="text-pharmacy-gray">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handleDownload} 
              className="bg-pharmacy-blue hover:bg-pharmacy-darkBlue"
            >
              <FilePdf className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </div>
      
      <PDFViewer 
        pdfData={pdfBlob} 
        fileName={`NAPRA_Risk_Assessment_${assessment.compoundName || 'Compound'}.pdf`} 
      />
    </div>
  );
};

export default NAPRAAssessmentReport;

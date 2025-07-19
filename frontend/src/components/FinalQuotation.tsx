import { useEffect, useState } from "react";
import type { NextStep, SketchDetail } from "../types/app";
import SketchForm from "./SketchForm";
import { useAxios } from "../api/axios";

interface SketchDetailsProps extends NextStep {
  sketchDetails?: SketchDetail;
}

function FinalQuotation({ sketchDetails, setSketchDetail, nextStep }: SketchDetailsProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPdfViewer, setShowPdfViewer] = useState<boolean>(true);

  const axios = useAxios();

  useEffect(() => {
    const fetchPdf = async () => {
      if (!sketchDetails?.quotation_id) return;

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `/quotations/${sketchDetails.quotation_id}/pdf/`,
          {
            responseType: 'blob',
          }
        );

        // Create a blob with explicit PDF MIME type
        const blob = new Blob([response.data], { 
          type: 'application/pdf' 
        });
        
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        console.log('PDF fetched successfully');
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [sketchDetails?.quotation_id,sketchDetails?.refrech]);

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `quotation-${sketchDetails?.quotation_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
      <SketchForm 
        sketchDetails={sketchDetails} 
        setSketchDetail={setSketchDetail} 
        nextStep={nextStep} 
        showbtns={false} 
      />
      
      <div className="flex-1 ml-4">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {pdfUrl && !loading && (
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex space-x-4 lg:flex-nowrap flex-wrap mb-4 gap-2">
              <button
                onClick={openInNewTab}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:text-[12px] text:[6px] py-2 rounded-lg font-medium"
              >
                📄 Open PDF in New Tab
              </button>
              
              <button
                onClick={downloadPdf}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 sm:text-[12px] text:[6px] rounded-lg font-medium"
              >
                ⬇️ Download PDF
              </button>
              
              <button
                onClick={() => setShowPdfViewer(!showPdfViewer)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg sm:text-[12px] text:[6px] font-medium"
              >
                {showPdfViewer ? '🙈 Hide Viewer' : '👁️ Show Viewer'}
              </button>
            </div>

            {/* PDF Viewer */}
            {showPdfViewer && (
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
                  PDF Preview - If not displaying correctly, use "Open in New Tab" or "Download"
                </div>
                
                <div style={{ height: '600px' }}>
                  <embed
                    src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Fallback message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>Note:</strong> If the PDF doesn't display above, your browser might not support inline PDF viewing. 
                Use the "Open in New Tab" or "Download" buttons instead.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinalQuotation;
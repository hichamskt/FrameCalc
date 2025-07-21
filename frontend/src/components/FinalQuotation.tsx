import { useEffect, useState } from "react";
import type { NextStep, SketchDetail } from "../types/app";
import SketchForm from "./SketchForm";
import { useAxios } from "../api/axios";
import PdfViewer from "./PdfViewer";

interface SketchDetailsProps extends NextStep {
  sketchDetails?: SketchDetail;
}

function FinalQuotation({ sketchDetails, setSketchDetail, nextStep }: SketchDetailsProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
      <SketchForm 
        sketchDetails={sketchDetails} 
        setSketchDetail={setSketchDetail} 
        nextStep={nextStep} 
        showbtns={false} 
      />
      <PdfViewer loading={loading} error={error} pdfUrl={pdfUrl} sketchDetails={sketchDetails} />
      
    </div>
  );
}

export default FinalQuotation;


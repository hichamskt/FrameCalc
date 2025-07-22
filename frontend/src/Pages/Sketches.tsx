import { useEffect, useState } from "react";
import SketchGallery from "../components/SketchGallery";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../api/axios";
import PdfViewer from "../components/PdfViewer";
import type { SketchDetail } from "../types/app";
import { IoMdArrowBack } from "react-icons/io";

function Sketches() {
  const { user } = useAuth();
  const [showPdf, setShowPdf] = useState<boolean>(false);

  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [sketchId, setSketchId] = useState<string>("");
  const [sketchDetails, setSketchDetails] = useState<SketchDetail>();
  const axios = useAxios();

  useEffect(() => {
    const fetchPdf = async () => {
      if (!sketchId) return;

      setSketchDetails((prev) => ({
        ...prev!,
        sketch_id: sketchId,
      }));

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`sketches/${sketchId}/quotation/pdf/`, {
          responseType: "blob",
        });

        const blob = new Blob([response.data], {
          type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        console.log("PDF fetched successfully");
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Failed to load PDF ");
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
  }, [sketchId]);

  useEffect(() => {
    const DeleteSketchesWithoutQiotation = async () => {
      try {
       await axios.delete(`/sketches/without-quotations/`);
        console.log("Deleted  successfully");
      } catch (error) {
        console.error("Error deleting :", error);
      
      }
    };

    DeleteSketchesWithoutQiotation();

    
  }, []);


  const handlePdf = (id:string , showPdf:boolean):void=>{
    setSketchId(id);
    setShowPdf(showPdf);
  }

  return (
    <div className="w-full container">
      <p className="text-white  p-4 text-3xl font-medium">Sketches History</p>
      {showPdf ? (
        <>
        <div className="text-white p-2 text-2xl rounded-[50%] cursor-pointer bg-[#37446B] w-fit ml-4 mb-4 hover:bg-[#7E89AC]" onClick={() => setShowPdf(false)}>
        <IoMdArrowBack />

        </div>
        <PdfViewer
          loading={loading}
          pdfUrl={pdfUrl}
          sketchDetails={sketchDetails}
          error={error}
          />
          </>
      ) : (
        user?.id && <SketchGallery userId={user.id} handlePdf={handlePdf}/>
      )}
    </div>
  );
}

export default Sketches;

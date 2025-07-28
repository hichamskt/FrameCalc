import { Plus, AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";
import { useAxios } from "../api/axios";

interface Piece {
  width: string;
  height: string;
  quantity: string;
}

function AlucobondCutting() {
    const [layOut,setLayout]=useState<string>();
    const [layOutPdfUrl,setLayoutPdfUrl]=useState<string>();




   const downloadPdf = () => {
    if (layOutPdfUrl) {
      const link = document.createElement('a');
      link.href = layOutPdfUrl;
      link.download = `Layout.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className="min-h-screen  p-8">
      <div className="text-white ">
        <h1 className="text-2xl font-bold mb-2">Alucobond Cutting</h1>
        <p className="text-gray-300 mb-6">Cutting layout generated</p>
        <div className="grid lg:grid-cols-2  ">
          <LeftInputs  setLayout={setLayout}  setLayoutPdfUrl={setLayoutPdfUrl}/>
         {layOut &&  <div className="" >
            <button className=" px-4 py-2 rounded transition-colors bg-green-800 hover:bg-green-400 cursor-pointer mb-1" onClick={()=>downloadPdf()}>Download Pdf</button>
            <img src={layOut}  alt="generated image" className="w-full"/>
          </div>}
        </div>

      </div>
    </div>
  )
}

export default AlucobondCutting

type LeftInputsTypes = {
    setLayout:  React.Dispatch<React.SetStateAction<string | undefined>>;
    setLayoutPdfUrl:  React.Dispatch<React.SetStateAction<string | undefined>>;
}

function LeftInputs({setLayout , setLayoutPdfUrl}:LeftInputsTypes) {
  const [sheetWidth, setSheetWidth] = useState<string>("");
  const [sheetHeight, setSheetHeight] = useState<string>("");
  const [pieces, setPieces] = useState<Piece[]>([{
    width: "",
    height: "",
    quantity: ""
  }]);

const axios = useAxios();

 const generateLayout = async () => {
  try {
    const fetchedData =  await axios.post(`/optimize-cut/`, 

         {
  sheet_width: parseInt(sheetWidth),
  sheet_height: parseInt(sheetHeight),
  pieces: pieces.map(p => ({
    width: parseInt(p.width),
    height: parseInt(p.height),
    quantity: parseInt(p.quantity)
  }))
}


    );

    console.log("successfully",fetchedData);
    setLayout(fetchedData.data.svg_download_url);
   setLayoutPdfUrl(fetchedData.data.pdf_download_url);
  } catch (error) {
    console.error("Error deleting:", error);
  }
};





  // Calculate validation results
  const validation = useMemo(() => {
    const sheetW = parseFloat(sheetWidth) || 0;
    const sheetH = parseFloat(sheetHeight) || 0;
    
    let totalArea = 0;
    const oversizedPieces: number[] = [];
    let hasEmptyInputs = false;
    
    pieces.forEach((piece, index) => {
      const w = parseFloat(piece.width) || 0;
      const h = parseFloat(piece.height) || 0;
      const q = parseInt(piece.quantity) || 0;
      
      // Check for empty inputs
      if (!piece.width || !piece.height || !piece.quantity) {
        hasEmptyInputs = true;
      }
      
      // Check if piece dimensions exceed sheet dimensions
      if (w > sheetW || h > sheetH) {
        oversizedPieces.push(index);
      }
      
      // Calculate total area
      totalArea += (w * h * q);
    });
    
    const sheetArea = sheetW * sheetH;
    const areaExceeded = totalArea > sheetArea;
    
    return {
      sheetArea,
      totalArea,
      areaExceeded,
      oversizedPieces,
      hasEmptyInputs,
      utilizationPercent: sheetArea > 0 ? (totalArea / sheetArea) * 100 : 0
    };
  }, [sheetWidth, sheetHeight, pieces]);

  const handleAddPieces = () => {
    // Prevent adding if there are empty inputs
    if (validation.hasEmptyInputs) {
      return;
    }
    
    setPieces((prev) => [
      ...prev,
      {
        width: "",
        height: "",
        quantity: ""
      }
    ]);
  };

  const handlePieceChange = (index: number, field: 'width' | 'height' | 'quantity', value: string) => {
    // Prevent negative values
    if (parseFloat(value) < 0) return;
    
    setPieces((prev) => 
      prev.map((piece, i) => 
        i === index ? { ...piece, [field]: value } : piece
      )
    );
  };

  const handleRemovePiece = (index: number) => {
    if (pieces.length > 1) {
      setPieces((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const canAddPiece = !validation.hasEmptyInputs && pieces.length < 20; // Limit to 20 pieces max

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Sheet Dimensions</h2>
        <div className="flex gap-4 flex-wrap">
          <CustomInput 
            label="Sheet Width (mm)" 
            value={sheetWidth} 
            onChange={setSheetWidth} 
            type="number"
            placeholder="e.g. 1220"
            required
          />
          <CustomInput 
            label="Sheet Height (mm)" 
            value={sheetHeight} 
            onChange={setSheetHeight} 
            type="number"
            placeholder="e.g. 2440"
            required
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Pieces to Cut</h2>
        
        {/* Validation Alerts */}
        {(validation.areaExceeded || validation.oversizedPieces.length > 0) && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle size={20} />
              <span className="font-semibold">Validation Errors</span>
            </div>
            {validation.areaExceeded && (
              <p className="text-red-300 text-sm mb-1">
                • Total area ({validation.totalArea.toLocaleString()} mm²) exceeds sheet area ({validation.sheetArea.toLocaleString()} mm²)
              </p>
            )}
            {validation.oversizedPieces.length > 0 && (
              <p className="text-red-300 text-sm">
                • Pieces {validation.oversizedPieces.map(i => i + 1).join(', ')} exceed sheet dimensions
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          {pieces.map((piece, index) => (
            <div key={index} className={`p-4 rounded-lg transition-all ${
              validation.oversizedPieces.includes(index) 
                ? 'bg-red-900/20 border border-red-500/30' 
                : 'bg-black/20'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 font-medium">
                  Piece {index + 1}
                  {validation.oversizedPieces.includes(index) && (
                    <span className="text-red-400 text-xs ml-2">(Too large for sheet)</span>
                  )}
                </span>
                {pieces.length > 1 && (
                  <button
                    onClick={() => handleRemovePiece(index)}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <CustomInput 
                  label="Width (mm)" 
                  value={piece.width} 
                  onChange={(value) => handlePieceChange(index, 'width', value)} 
                  type="number"
                  placeholder="Width"
                  required
                  error={validation.oversizedPieces.includes(index)}
                />
                <CustomInput 
                  label="Height (mm)" 
                  value={piece.height} 
                  onChange={(value) => handlePieceChange(index, 'height', value)} 
                  type="number"
                  placeholder="Height"
                  required
                  error={validation.oversizedPieces.includes(index)}
                />
                <CustomInput 
                  label="Quantity" 
                  value={piece.quantity} 
                  onChange={(value) => handlePieceChange(index, 'quantity', value)} 
                  type="number"
                  placeholder="Qty"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleAddPieces}
            disabled={!canAddPiece}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              canAddPiece
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            title={
              validation.hasEmptyInputs 
                ? "Please fill all empty fields before adding a new piece"
                : pieces.length >= 20
                ? "Maximum 20 pieces allowed"
                : "Add new piece"
            }
          >
            <Plus size={20} />
            Add Piece
          </button>
        </div>
        
        {validation.hasEmptyInputs && (
          <p className="text-yellow-400 text-sm text-center mt-2">
            Fill all empty fields before adding new pieces
          </p>
        )}
      </div>

      {/* Enhanced Preview Section */}
      <div className={`p-4 rounded-lg mt-8 transition-all ${
        validation.areaExceeded || validation.oversizedPieces.length > 0
          ? 'bg-red-900/20 border border-red-500/30'
          : validation.utilizationPercent > 90
          ? 'bg-yellow-900/20 border border-yellow-500/30'
          : 'bg-black/30'
      }`}>
        <h3 className="text-white font-semibold mb-3">Current Configuration:</h3>
        <div className="text-gray-300 space-y-1">
          <p>Sheet: {sheetWidth || '0'} × {sheetHeight || '0'} mm ({validation.sheetArea.toLocaleString()} mm²)</p>
          <p>Pieces: {pieces.length}</p>
          <p>Total Cut Area: {validation.totalArea.toLocaleString()} mm²</p>
          <p className={`font-medium ${
            validation.utilizationPercent > 100 
              ? 'text-red-400' 
              : validation.utilizationPercent > 90 
              ? 'text-yellow-400' 
              : 'text-green-400'
          }`}>
            Material Utilization: {validation.utilizationPercent.toFixed(1)}%
          </p>
          {pieces.map((piece, index) => {
            const w = parseFloat(piece.width) || 0;
            const h = parseFloat(piece.height) || 0;
            const q = parseInt(piece.quantity) || 0;
            const area = w * h * q;
            
            return (
              <p key={index} className={`text-sm ${
                validation.oversizedPieces.includes(index) ? 'text-red-400' : ''
              }`}>
                • Piece {index + 1}: {w} × {h} mm × {q} pcs = {area.toLocaleString()} mm²
              </p>
            );
          })}
          <button disabled={!canAddPiece} onClick={()=>generateLayout()} className="'bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded bg-pink-800 cursor-pointer transition-colors mt-2" >layout generate</button>
        </div>
      </div>
    </div>
  )
}

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  required = false,
  error = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-xs">
      <label className="block text-white text-sm font-medium mb-2">
        {label}
        {required && <span className="text-purple-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={0}
          step={type === 'number' ? '0.1' : undefined}
          className={`
            w-full
            bg-transparent
            text-white
            text-lg
            py-2
            px-0
            border-0
            border-b-2
            outline-none
            transition-all
            duration-300
            placeholder-gray-400
            ${isFocused 
              ? error 
                ? 'border-b-red-500' 
                : 'border-b-purple-500'
              : error
                ? 'border-b-red-600'
                : 'border-b-purple-600'
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : error
                ? 'hover:border-b-red-400'
                : 'hover:border-b-purple-400'
            }
          `}
        />
        <div 
          className={`
            absolute
            bottom-0
            left-0
            h-0.5
            bg-gradient-to-r
            transition-all
            duration-300
            ${error 
              ? 'from-red-400 to-red-500' 
              : 'from-purple-400 to-pink-500'
            }
            ${isFocused ? 'w-full' : 'w-0'}
          `}
        />
      </div>
    </div>
  );
};
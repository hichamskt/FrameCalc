import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiImageAiFill } from "react-icons/ri";
import DashboardButton from "./ui/DashboardButton";
import { useAuth } from "../context/AuthContext";
import { useAxios } from "../api/axios";
import type { NextStep } from "../types/app";

function MediaUpdate({ nextStep, setSketchDetail }: NextStep) {
  const { user } = useAuth();

  const [image, setImage] = useState<File | null>(null);
  const axios = useAxios();

  const handleSubmit = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("user", user?.id || "");
    formData.append("image", image);

    try {
      const response = await axios.post("/sketches/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;


      {
        setSketchDetail((prev) => ({
          ...prev,
          width: result?.width,
          height: result?.height,
          frame: "",
          subtype_id: "",
          company_id: "",
          profile_id: "",
          quotation_id:"",
          subtype_requirements:"",
          glassrequirement_id:"",
          accessoriesrequirement_id:"",
          sketch_id:result.sketch_id,
        }));
      }

      nextStep();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-[#000842] text-white p-3 flex flex-col gap-2 min-h-[60%] ">
      <p className="text-[16px]">Media Upload</p>
      <p className="text-[10px]">
        Add your documents here, and you can upload 1 file max
      </p>
      <SingleImageDropzone image={image} setImage={setImage} />
      <p className="text-[10px]">
        Only support .jpg, .png and .svg and zip files
      </p>
      <div className="self-end">
        <DashboardButton text="Next" onclick={handleSubmit} />
      </div>
    </div>
  );
}

export default MediaUpdate;

type ImgType = {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
};

const SingleImageDropzone: React.FC<ImgType> = ({ image, setImage }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
      }
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    multiple: false,
  });

  useEffect(() => {
    let objectUrl: string | null = null;

    if (image) {
      objectUrl = URL.createObjectURL(image);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image]);

  return (
    <div
      {...getRootProps()}
      className="border border-dashed border-gray-400 p-6 text-center cursor-pointer rounded-lg w-full bg-white min-h-[200px]"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-6xl text-blue-600">
            <RiImageAiFill />
          </div>
          <p className="text-blue-500">Drop your image here...</p>
        </div>
      ) : image ? (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="h-48 object-cover rounded-md mx-auto"
        />
      ) : (
        <div className="flex items-center flex-col gap-1.5">
          <div className="text-blue-600 text-6xl">
            <IoCloudUploadOutline />
          </div>
          <p className="text-gray-600 text-[16px]">
            Drag your file or{" "}
            <span className="font-bold text-blue-600">browse</span>
          </p>
          <p className="text-gray-600 text-[14px] font-light">
            Max 10 MB files are allowed
          </p>
        </div>
      )}
    </div>
  );
};

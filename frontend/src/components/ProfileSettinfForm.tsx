import { useCallback, useEffect, useRef, useState } from "react";
import SettingsInput from "./ui/SettingsInput";
import { Mail } from "lucide-react";
import { useUser } from "../hooks/useUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import Loading from "./ui/Loading";
import fallback from "../assets/person.jpg";
import { Image } from "lucide-react";

function ProfileSettinfForm() {
  const { user } = useUser();
  const [UserName, setUserName] = useState<string>(user?.username || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({
    UserName: "",
    email: "",
  });
  const [image, setImage] = useState<string>(
    user?.profile_image_url || fallback
  );

  useEffect(() => {
    setImage(user?.profile_image_url || fallback);
  }, [user]);

  const { handleUpdate, error, loading } = useUpdateUser();
  useEffect(() => {
    setEmail(user?.email || "");
    setUserName(user?.username || "");
  }, [user]);
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setUserName(e.target.value);
}, []);


  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const validateInputs = (username: string, email: string) => {
    const errors: { [key: string]: string } = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Email is invalid";
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const onSubmit = () => {
    if (!validateInputs(UserName, email)) return;

    const data: { username?: string; email?: string; profile_image?: File } =
      {};

    if (UserName.trim()) data.username = UserName.trim();
    if (email.trim()) data.email = email.trim();
    if (file) data.profile_image = file;

    handleUpdate(data);
    if (error) setInputErrors(error);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setImage(url);
    }
  };


  return (
    <div className="bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 lg:w-[60%] w-full">
      <SettingsInput
        label={"UserName"}
        value={UserName}
        placeholder="Enter your username "
        onChange={handleUsernameChange}
        error={inputErrors.username}
      />
      <hr className="my-4 border-gray-300" />

      <SettingsInput
        label={"Email"}
        icon={Mail}
        value={email}
        placeholder="Enter your username "
        onChange={handleEmailChange}
        error={inputErrors.email}
      />
      <hr className="my-4 border-gray-300" />

      <div className="grid grid-cols-[20%_75%] gap-4">
        <p className="flex gap-1 text-sm font-medium text-gray-300 min-w-0 items-center">
          <Image className="w-4 h-4 mr-2" /> Image{" "}
        </p>
        <div className="flex sm:items-start sm:justify-between items-center gap-6 flex-col sm:flex-row justify-center">
          <img
            src={image}
            alt="profile"
            className=" w-[80px] h-[80px] object-cover rounded-[50%]"
          />

          <div className="flex flex-col items-center gap-2">
            <div
              className="p-3 rounded-[50%] bg-[#cb3cff75] w-fit cursor-pointer"
              onClick={handleButtonClick}
            >
              <Image className="text-[#CB3CFF]" />
            </div>
            <p className="text-sm text-[#CB3CFF] font-bold cursor-pointer">
              Click to upload
            </p>
            <p className="text-sm">SVG, PNG, JPG (max. 800 x 400px)</p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="flex justify-end w-full ">
        <button
          className="bg-[#CB3CFF] text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => onSubmit()}
          disabled={loading}
        >
          {loading ? <Loading /> : "Update"}
        </button>
      </div>
    </div>
  );
}

export default ProfileSettinfForm;

import { useCallback, useEffect, useState } from "react"
import SettingsInput from "./ui/SettingsInput";
import { LockKeyhole } from 'lucide-react';
import { useChangePassword } from "../hooks/useChangePassword";
import Loading from "./ui/Loading";


function PasswordUpdate() {
    const [oldPassword,setOldPassword]=useState<string>("");
    const [newPassword,setNewPassword]=useState<string>("");
    const [confirmPassword,setConfirmPassword]=useState<string>("");
    const [oldPasswordError,setOldPasswordError]=useState<string>('');
    const [newPasswordError,setNewPasswordError]=useState<string>('');
    const [confirmPasswordError,setConfirmPasswordError]=useState<string>('');
    const {submit , loading ,error} = useChangePassword();
 const handleOldPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setOldPassword(e.target.value);
  setOldPasswordError('');
}, []);

const handleNewPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setNewPassword(e.target.value);
  setNewPasswordError('');
}, []);

const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setConfirmPassword(e.target.value);
  setConfirmPasswordError('');
}, []);

    

const validatePasswords = () => {
  let valid = true;

  if (!oldPassword) {
    setOldPasswordError('Old password is required');
    valid = false;
  }

  if (!newPassword || newPassword.length < 6) {
    setNewPasswordError('New password must be at least 6 characters');
    valid = false;
  }

  if (newPassword !== confirmPassword) {
    setConfirmPasswordError('Passwords do not match');
    valid = false;
  }

  return valid;
};

  const onSubmit = () => {
    
    if (!validatePasswords()) return;
    submit(oldPassword,newPassword);
    
   
  };

  useEffect(() => {
  if (error) {
    
    setOldPasswordError(error); 
  }
}, [error]);




  return (
   <div className="bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 lg:w-[60%] w-full">
    <SettingsInput label={"Old Password"} value={oldPassword} onChange={handleOldPasswordChange} type="password"    error={oldPasswordError} icon={LockKeyhole} />
    <SettingsInput label={"New Password"} value={newPassword} onChange={handleNewPasswordChange} type="password"    error={newPasswordError} icon={LockKeyhole} />
    <SettingsInput label={"Confirm Password"} value={confirmPassword} onChange={handleConfirmPasswordChange} type="password"    error={confirmPasswordError} icon={LockKeyhole} />

    <div className="flex justify-end w-full ">
        <button
          className="bg-[#CB3CFF] text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => onSubmit()}
         disabled={loading || !oldPassword || !newPassword || !confirmPassword}
        >
          {loading ? <Loading /> : "Update"}
        </button>
      </div>
    </div>
  )
}

export default PasswordUpdate
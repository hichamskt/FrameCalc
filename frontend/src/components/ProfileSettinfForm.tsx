import { useState } from 'react';
import SettingsInput from './ui/SettingsInput'
import { Mail } from 'lucide-react';

function ProfileSettinfForm() {
    const [UserName,setUserName] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({
        UserName:"",
        email:""
    });

const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUserName(e.target.value);
};

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
};


const validateInputs = (UserName: string, email: string) => {
  const errors: { [key: string]: string } = {};

  if (!UserName.trim()) {
    errors.UserName = "Username is required";
  } else if (UserName.length < 3) {
    errors.UserName = "Username must be at least 3 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Email is invalid";
  }

  setInputErrors(errors);

  
  return Object.keys(errors).length === 0;
};

const onSubmit = ()=>{
if(validateInputs(UserName, email)) return;

}
  
  return (
    <div className='bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F]'>
        <SettingsInput label={'UserName'} value={''} placeholder='Enter your username ' onChange={handleUsernameChange}  error={inputErrors.username} />
        <SettingsInput label={'UserName'} icon={ Mail} value={''} placeholder='Enter your username ' onChange={handleEmailChange}  error={inputErrors.email}  />
    </div>
  )
}

export default ProfileSettinfForm
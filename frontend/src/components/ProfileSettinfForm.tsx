import { useEffect, useState } from 'react';
import SettingsInput from './ui/SettingsInput'
import { Mail } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';

function ProfileSettinfForm() {
  const{user} = useUser();
    const [UserName,setUserName] = useState<string>(user?.username || "");
    const [email,setEmail] = useState<string>(user?.email || "");
    const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({
        UserName:"",
        email:""
    });
const {handleUpdate ,error , loading} = useUpdateUser();
    useEffect(()=>{
      setEmail(user?.email || "");
      setUserName(user?.username || "")
    },[user])
const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUserName(e.target.value);
};

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value);
};


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

  const data: { username?: string; email?: string; image?: File } = {};

  if (UserName.trim()) data.username = UserName.trim();
  if (email.trim()) data.email = email.trim();
 

  handleUpdate(data);
  if(error) setInputErrors(error)
  
};

console.log("err",inputErrors)


  
  return (
    <div className='bg-[#0B1739] p-5 rounded-2xl border border-[#343B4F] flex flex-col gap-9 sm:w-[60%] w-full'>
        <SettingsInput label={'UserName'} value={UserName} placeholder='Enter your username ' onChange={handleUsernameChange}  error={inputErrors.username} />
        <hr className="my-4 border-gray-300" />

        <SettingsInput label={'UserName'} icon={ Mail} value={email} placeholder='Enter your username ' onChange={handleEmailChange}  error={inputErrors.email}  />
        <hr className="my-4 border-gray-300" />

        <div>

        </div>
        <button onClick={()=>onSubmit()} >submiit</button>
    </div>
  )
}

export default ProfileSettinfForm
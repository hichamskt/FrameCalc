import logo from "../assets/logo 1.png"
import LoginInput from "./ui/LoginInput"
import { useState } from "react";
import LoginButton from "./ui/LoginButton";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./ui/Loading";

function LoginForm() {
  return (
    <div className="flex flex-col justify-center items-center gap-2">
        <img src={logo} alt="logo" />
        <Form/>
    </div>
  )
}

export default LoginForm

type user={
     email: string,
    password: string
}

function Form( ){
    
  const navigate = useNavigate();
  const { login } = useAuth();

const [values, setValues] = useState<user>({
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading,setLoading] = useState<boolean>(false)

  const [errors, setErrors] = useState<user>({
    email: "",
    password: "",

  });

const handleErrors = (values: user): boolean => {
  const newErrors: user = {
    email: "",
    password: "",
  };

  
  if (!values.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    newErrors.email = "Invalid email format";
  }

 
  if (!values.password.trim()) {
    newErrors.password = "Password is required";
  } else if (values.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }


  setErrors(newErrors);

  
  return Object.values(newErrors).every((err) => err === "");
};

const handleSubmit =  async (e: React.FormEvent) => {
  e.preventDefault();
  const isValid = handleErrors(values); 

  if (isValid) {
    
setLoading(true);
try {
  const{email,password}=values;
  await login({ email , password });
  navigate("/contact"); 
} catch (error) {
  setErrorMsg("Invalid credentials or server error");
  console.log("error:",error)
}

}
setLoading(false);
};




    return(
        <form className="bg-[rgba(0,8,66,0.2)]
  text-white
  p-8
  sm:min-w-[400px]
  min-w-[320px]
  rounded-2xl
  flex
  flex-col
  gap-6
  shadow-lg
  backdrop-blur-sm
  w-full
  max-w-md
  mx-auto"
  onSubmit={handleSubmit}
  >
    {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}
            <h1>Login to your account</h1>
            <div>

            <LoginInput  label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          values={values}
          setValues={setValues}
          errors={errors}
          />
            <LoginInput  label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          values={values}
          setValues={setValues}
          errors={errors}
          />
          </div>
          {loading ? 
          <div className="flex items-center justify-center">

          <Loading/> 
          </div>
          : <LoginButton />}
          <p className="text-sm font-medium text-[#999999] mb-1 text-center">Don't have an account?  <Link  className="hover:text-white transition-colors" to="/signup" > Sign up</Link></p>
        </form>
    )
}
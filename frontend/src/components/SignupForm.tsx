/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import SignupInput from "./ui/SignupInput";
import type { User } from "../types/app";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import RegisterButton from "./ui/RegisterButton";
import salyimg from "../assets/Saly.png";
import { useAuth } from "../context/AuthContext";
import Loading from "./ui/Loading";

function SignupForm() {
  return (
    <div className="container bg-white md:rounded-3xl p-2 grid  md:grid-cols-2 gap-4 md:max-w-[80%] ">
      <Form />
      <RigthSide />
    </div>
  );
}

export default SignupForm;

function Form() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [values, setValues] = useState<User>({
    email: "",
    username: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState<User>({
    email: "",
    username: "",
    password: "",
    password2: "",
  });

  const handleErrors = () => {
    const newErrors: User = {
      email: "",
      username: "",
      password: "",
      password2: "",
    };

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Invalid email format";
    }

    if (values.username === undefined || !values.username.trim()) {
      newErrors.username = "Username is required";
    } else if (values.username.length < 3 || values.username.length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
      newErrors.username = "Only letters, numbers, and underscores are allowed";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (values.password2 !== values.password) {
      newErrors.password2 = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((val) => val === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = handleErrors();

    if (isValid) {
      setLoading(true);
      try {
        const { email, password, username, password2 } = values;
        await register({ email, password, username, password2 });
        navigate("/contact");
      } catch (error) {
        const err = error as any;
        if (err.response?.data) {
          setErrors(err.response.data);
        } else {
          setErrorMsg("Something went wrong. Try again.");
        }
      }
    }
    setLoading(false);
  };

  return (
    <form className="p-6 flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <h1 className=" text-base font-bold">Sign up</h1>

        <div className="font-medium">
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          <p>If you already have an account register</p>
          <p>
            You can
            <Link
              to="/login"
              className="font-bold text-[#0C21C1] cursor-pointer"
            >
              {" "}
              Login here !
            </Link>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:w-[80%]  w-[90%]">
        <SignupInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          values={values}
          setValues={setValues}
          errors={errors}
          Icon={MdOutlineEmail}
        />
        <SignupInput
          label="Username"
          name="username"
          type="text"
          placeholder="Enter your User name"
          values={values}
          setValues={setValues}
          errors={errors}
          Icon={FaRegUser}
        />
        <SignupInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your Password"
          values={values}
          setValues={setValues}
          errors={errors}
          Icon={CiLock}
        />
        <SignupInput
          label="Confrim Password"
          name="password2"
          type="password"
          placeholder="Confrim your Password"
          values={values}
          setValues={setValues}
          errors={errors}
          Icon={CiLock}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center w-[80%]">
          <Loading />
        </div>
      ) : (
        <RegisterButton />
      )}
    </form>
  );
}

function RigthSide() {
  return (
    <div className="bg-[#000842] rounded-2xl text-3xl text-white p-5 md:flex flex-col justify-between  hidden">
      <img src={salyimg} alt="salyimg" className="mx-auto" />
      <p className="font-medium">Sign Up to Framcal</p>
    </div>
  );
}

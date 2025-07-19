import { MdAddCall } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import ContactInput from "./ContactInput";
import { Button } from "./ui/button";
import eclips from "../assets/Ellipse.png";
import eclips1 from "../assets/Ellipse1.png";
import { useState } from "react";

function ContactForm() {
  return (
    <div className="container md:grid grid-cols-[40%_60%] bg-white rounded-2xl p-3 gap-5 mb-20">
      <Infos />
      <Form />
    </div>
  );
}

export default ContactForm;

function Infos() {
  return (
    <div className="bg-black text-white rounded-2xl flex flex-col gap-20 p-8 relative">
      <div>
        <h1 className="font-bold text-2xl">Contact Information</h1>
        <p className="text-[#C9C9C9] text-[16px]">
          {" "}
          Say something to start a live chat!
        </p>
      </div>
      <ul className="flex flex-col gap-6 z-40">
        <li className="flex gap-3 items-center">
          <MdAddCall />
          <p>+1012 3456 789</p>
        </li>
        <li className="flex gap-3 items-center z-40">
          <MdEmail />
          <p>demo@gmail.com</p>
        </li>
        <li className="flex gap-3 items-center z-40">
          <FaMapMarkerAlt />
          <p>Agadir - al houda</p>
        </li>
      </ul>
      <img
        src={eclips}
        alt="eclips"
        className="absolute bottom-20 right-20 z-10"
      ></img>
      <img
        src={eclips1}
        alt="eclips"
        className="absolute bottom-0 right-0"
      ></img>
    </div>
  );
}

type values = {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  message: string;
};

function Form() {
  const [values, setValues] = useState<values>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    lastname: "",
    firstname: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const validate = () => {
    const tempErrors = { ...errors };
    let isValid = true;

    if (!values.lastname.trim()) {
      tempErrors.lastname = "Last name is required";
      isValid = false;
    } else {
      tempErrors.lastname = "";
    }
    if (!values.firstname.trim()) {
      tempErrors.firstname = "first name is required";
      isValid = false;
    } else {
      tempErrors.firstname = "";
    }

    if (!values.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    } else {
      tempErrors.email = "";
    }

    if (!values.phoneNumber.trim()) {
      tempErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^[\d +()-]+$/.test(values.phoneNumber)) {
      tempErrors.phoneNumber = "Phone number is invalid";
      isValid = false;
    } else {
      tempErrors.phoneNumber = "";
    }

    if (!values.message.trim()) {
      tempErrors.message = "Message is required";
      isValid = false;
    } else {
      tempErrors.message = "";
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Form is valid", values);
    } else {
      console.log("Form has errors", errors);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-12">
      <div className="grid sm:grid-cols-2 gap-4 ">
        <ContactInput
          label="First Name"
          placeholder="JOE"
          name="firstname"
          type="text"
          values={values}
          setValues={setValues}
          errors={errors}
           
        />
        <ContactInput
          label="Last Name"
          placeholder="Dan"
          name="lastname"
          type="text"
          values={values}
          setValues={setValues}
          errors={errors}
          
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 ">
        <ContactInput
          label="Email"
          placeholder="exmaple@gmail.com"
          name="email"
          type="email"
          values={values}
          setValues={setValues}
          errors={errors}
          
        />
        <ContactInput
          label="Phone Number"
          placeholder="+212614828609"
          name="phoneNumber"
          type="tel"
          values={values}
          setValues={setValues}
          errors={errors}
           
        />
      </div>
      <div className="mt-14">
        <ContactInput
          label="Message"
          placeholder="Write your message.."
          name="message"
          type="text"
          values={values}
          setValues={setValues}
          errors={errors} 
          
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>Send Message</Button>
      </div>
    </div>
  );
}

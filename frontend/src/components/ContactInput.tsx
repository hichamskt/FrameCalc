

type Values = {
    firstname:string;
    lastname:string;
    email:string;
    phoneNumber:string;
    message:string
}
type Errors = {
    firstname:string;
     lastname: string;
    email: string;
    phoneNumber: string;
    message: string;
}


type Input = {
    label:string;
    placeholder:string;
    name:keyof Values;
    type:string;
    values:Values;
    setValues: React.Dispatch<React.SetStateAction<Values>>;
    errors:Errors;
   
}

function ContactInput({ label, placeholder, name ,type , values, setValues,errors}: Input) {
   

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === "phoneNumber") {
    const cleaned = value.replace(/[^\d+ ]/g, "");
    setValues({
      ...values,
      [name]: cleaned,
    });
  } else {
    setValues({
      ...values,
      [name]: value,
    });
  }
};


  return (
    <div>
        <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
       <input
        type={type}
        id={name}
        name={name}
       
        required
        value={values[name]}
        onChange={handleChange}
        className="w-full px-4 py-2  border-b-2 border-gray-400 focus:border-black  focus:outline-none "
        placeholder={placeholder}
      />

      {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
    )}

    </div>
  )
}

export default ContactInput
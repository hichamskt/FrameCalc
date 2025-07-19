import type { InputTypes } from "../../types/app";

function SignupInput({
  label,
  name,
  type,
  placeholder,
  values,
  setValues,
  errors,
  Icon,
}: InputTypes) {
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <div>
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[#999999] mb-1"
        >
          {label}
        </label>

        <div className="flex items-center border-b-2 border-gray-400 focus-within:border-black py-3 px-3 ">
          {Icon && <Icon className="text-gray-500 mr-2 " />}
          <input
            type={type}
            placeholder={placeholder}
            id={name}
            name={name}
            required
            value={values[name]}
            onChange={handleChange}
            className="w-full outline-none bg-transparent"
          />
        </div>

        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
        )}
      </div>
    </div>
  );
}

export default SignupInput;

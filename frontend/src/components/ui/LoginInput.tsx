import { Link } from "react-router-dom";
import type { SignupInputTypes } from "../../types/app";

function LoginInput({
  label,
  name,
  type,
  placeholder,
  values,
  setValues,
  errors,
}: SignupInputTypes) {
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
        <div className="mb-4">
            <div className="text-sm font-medium text-[#999999] mb-1 flex justify-between">

          <label
            htmlFor={name}
            className="block "
            >
            {label}
          </label>
          {
            name==="password" && <Link to=""  className="hover:text-white transition-colors">Forget?</Link>}
          
              </div>

          <input
            type={type}
            placeholder={placeholder}
            id={name}
            name={name}
            required
            value={values[name]}
            onChange={handleChange}
            className="
      w-full
      px-4
      py-2
      bg-transparent
      text-sm
      text-white
      rounded
      border-gray-300
      focus:outline-none
      focus:border-[#194185]
      transition-colors
      duration-200
      border-[.5px]
    "
          />


        {errors[name] && (
          <p className="text-red-500 text-[12px] pt-1 font-medium">{errors[name]}</p>
        )}
      </div>
        </div>

    </div>
  );
}

export default LoginInput;

import type { SketchDetail } from "../../types/app";

export type InputTypes = {
  label: string;
  placeholder: string;
  name: keyof SketchDetail;
  type: string;
  values: SketchDetail;
  setValues: React.Dispatch<React.SetStateAction<SketchDetail | undefined>>;
  errors:SketchDetail
};

function SketchInput({
  label,
  placeholder,
  name,
  type,
  values,
  setValues,
  errors
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

        <div className="flex items-center border-b-2 border-gray-400 focus-within:border-[#ff08f76e] py-3 px-3  lg:w-[50%] w-full">
          <input
            type={type}
            placeholder={placeholder}
            id={name}
            name={name}
            required
            min={10}
            value={values[name]}
            onChange={handleChange}
            className=" outline-none bg-transparent w-full "
          />
        </div>
         {errors[name] && (
          <p className="text-red-500 text-[10px] pt-1 font-medium">{errors[name]}</p>
        )}
      </div>
    </div>
  );
}

export default SketchInput;

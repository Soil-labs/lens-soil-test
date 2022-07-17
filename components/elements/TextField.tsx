import { InputHTMLAttributes } from "react";

export type TextFieldProps = {
  name?: string;
  label?: string;
  value?: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  typeClass?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  value,
  type = "text",
  required,
  autoComplete,
  placeholder,
  typeClass,
  onChange,
}) => {
  return (
    <div className={typeClass}>
      <label
        htmlFor={name}
        className={"block text-sm font-medium text-gray-700"}
      >
        {label}
      </label>
      <div className={"mt-1"}>
        <input
          id={name}
          name={name}
          value={value}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e);
          }}
          className={
            "block w-full rounded-md border border-gray-300 shadow-sm text-base py-2 px-3 focus:outline-transparent focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          }
        />
      </div>
    </div>
  );
};

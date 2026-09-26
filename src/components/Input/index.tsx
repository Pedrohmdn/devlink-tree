import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input
      className="bg-white w-full  px-4 h-11 rounded-md text-base outline-none placeholder:text-gray-800 "
      {...props}
    />
  );
}

import type { ReactNode } from "react";

interface InputLabelProps {
  children: ReactNode;
  htmlFor: string;
  labelText: string;
}

export default function InputLabel({
  children,
  htmlFor,
  labelText,
}: InputLabelProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-white font-medium">
        {labelText}
      </label>
      {children}
    </div>
  );
}

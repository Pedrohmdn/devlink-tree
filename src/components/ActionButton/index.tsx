import type { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function ActionButton(props: ActionButtonProps) {
  return (
    <button
      {...props}
      className="w-full bg-blue-600 text-white h-11 rounded-md font-medium text-lg cursor-pointer flex items-center justify-center gap-2 px-4 "
    >
      {props.children}
    </button>
  );
}

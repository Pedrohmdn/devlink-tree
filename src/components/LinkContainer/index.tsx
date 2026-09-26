import type { ReactNode } from "react";

interface LinkContainerProps {
  text?: string;
  url?: string;
  children?: ReactNode;
  color?: string;
  background?: string;
}

export default function LinkContainer({
  url,
  children,
  color,
  background,
  text,
}: LinkContainerProps) {
  return (
    <div
      className={`w-full py-2.5 px-4 rounded-lg  bg-white select-none  ${url && "transition-transform hover:scale-105"}`}
      style={{
        color: color && color,
        backgroundColor: background && background,
      }}
    >
      {url === undefined ? (
        <p className="md:text-lg text-base w-full overflow-hidden text-center ">
          {text ? (
            text
          ) : (
            <span className="flex justify-between items-center">
              {children}
            </span>
          )}
        </p>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <p className="md:text-lg text-base w-full overflow-hidden text-center">
            {children}
          </p>
        </a>
      )}
    </div>
  );
}

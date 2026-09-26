import type { ReactNode } from "react";

interface socialProps {
  url: string;
  children: ReactNode;
}
export default function Social({ url, children }: socialProps) {
  return (
    <a
      href={url}
      rel="noopener noreferrer external"
      target="_blank"
      style={{ display: url === "" ? "none" : "inline" }}
    >
      {children}
    </a>
  );
}

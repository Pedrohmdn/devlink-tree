import { Outlet } from "react-router";
import Header from "../Header";

export default function AdminLayout() {
  return (
    <div className="flex flex-col items-center pt-8">
      <Header />
      <main className="max-w-150 w-full pb-10">
        <Outlet />
      </main>
    </div>
  );
}

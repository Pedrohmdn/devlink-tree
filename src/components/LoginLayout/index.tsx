import { Outlet } from "react-router";

export default function LoginLayout() {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-7 items-center max-w-xl w-full ">
        <h1 className="text-white text-5xl font-bold">
          Dev
          <span className="bg-linear-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">
            Link
          </span>
        </h1>

        <Outlet />
      </div>
    </main>
  );
}

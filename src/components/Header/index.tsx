import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { RxOpenInNewWindow } from "react-icons/rx";
import { useContext } from "react";
import { UserContext } from "../../contexts/user";

export default function Header() {
  const { user } = useContext(UserContext);

  async function handleLogOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <header className="bg-white h-14 rounded-md flex items-center px-3 max-w-175 justify-between  w-full mb-8 ">
      <nav className="flex items-center gap-4 font-medium">
        <Link to={`/admin/${user?.userName}`}>Links</Link>
        <Link to={`/admin/social/${user?.userName}`}>Redes Sociais</Link>
        <Link
          target="_blank"
          to={`/links/${user?.userName}`}
          className="flex gap-1 items-center"
        >
          Veja seus links <RxOpenInNewWindow size={20} color="#000" />
        </Link>
      </nav>
      <button onClick={handleLogOut} className="cursor-pointer ml-6">
        <FiLogOut size={24} color="#C51D1D" />
      </button>
    </header>
  );
}

import { Link, useNavigate } from "react-router";
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton";
import { auth, db } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      navigate(`/admin/${user?.userName}`, { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(formdata: FormData) {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const docref = doc(db, "users", response.user.uid);
      const docSnap = await getDoc(docref);
      navigate(`/admin/${docSnap.data()?.userName}`, {
        replace: true,
      });
    } catch (error: any) {
      switch (error.code) {
        case "auth/too-many-requests":
          toast.error("Muitas tentativas. Tente mais tarde.");
          break;
        case "auth/user-disabled":
          toast.error("Esta conta foi desativada.");
          break;
        case "auth/invalid-credential":
          toast.error("Email ou Senha inválida");
          break;

        default:
          toast.error(
            "Não foi possível concluir seu cadastro. Tente novamente.",
          );
          console.error("Erro inesperado:", error.message);
      }
    }
  }

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <form className="w-full" action={handleSubmit}>
        <div className="flex flex-col gap-4 mb-6">
          <Input
            name="email"
            type="email"
            placeholder="Digite seu email"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="**********"
            required
          />
        </div>
        <ActionButton type="submit">Acessar</ActionButton>
      </form>
      <span className="text-white text-sm">
        Não tem uma conta?{" "}
        <Link
          className="  underline decoration-solid font-medium "
          to={"/signup"}
        >
          Cadastre-se
        </Link>
      </span>
    </>
  );
}

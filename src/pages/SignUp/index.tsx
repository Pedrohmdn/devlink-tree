import { Link, useNavigate } from "react-router";
import Input from "../../components/Input";
import ActionButton from "../../components/ActionButton";
import { auth, db } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { doc, getDoc, writeBatch } from "firebase/firestore";

export default function SignUp() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const cleanUsername = userName.trim().toLowerCase();
    if (cleanUsername === "") {
      setIsAvailable(null);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const docRef = doc(db, "usernames", cleanUsername);
        const docSnap = await getDoc(docRef);
        setIsAvailable(!docSnap.exists());
      } catch (error) {
        console.error("Erro ao verificar username:", error);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [userName]);

  async function handleSubmit(formdata: FormData) {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;
    const cleanUserName = userName.trim().toLowerCase();

    if (isAvailable === null) {
      toast.warning("Aguarde a validação do nome de usuário...");
      return;
    }

    if (isAvailable === false) {
      toast.warning("O Nome do usuário já existe!");
      return;
    }
    let createdUser = null;

    const batch = writeBatch(db);

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      createdUser = response.user;

      batch.set(doc(db, "users", response.user.uid), {
        userName: cleanUserName,
        email: response.user.email,
        createdAt: new Date(),
      });

      batch.set(doc(db, "usernames", cleanUserName), {
        uid: response.user.uid,
      });

      await batch.commit();

      toast.success("Cadastro Concluído");
      navigate(`/login`, { replace: true });
    } catch (error: any) {
      console.error("Erro durante o processo de cadastro:", error);

      if (createdUser) {
        try {
          await createdUser.delete();
          console.log("Rollback: Usuário removido do Auth com sucesso.");
        } catch (deleteError) {
          console.error(
            "Falha crítica ao tentar deletar usuário órfão:",
            deleteError,
          );
        }
      }

      switch (error.code) {
        case "auth/too-many-requests":
          toast.error("Muitas tentativas. Tente mais tarde.");

          break;
        case "auth/weak-password":
          toast.error("A senha precisa ter no mínimo 8 dígitos");
          break;
        case "auth/email-already-in-use":
          toast.error("Este e-mail já está em uso");
          break;
        case "auth/invalid-email":
          toast.error("Email inválido");
          break;

        default:
          toast.error(
            "Não foi possível concluir seu cadastro. Tente novamente.",
          );
          console.error("Erro inesperado:", error.message);
      }
    }
  }

  return (
    <>
      <form className="w-full" action={handleSubmit}>
        <div className="flex flex-col gap-4 mb-6">
          <div
            className={`border-3 rounded-lg transition-colors border-transparent border-solid ${isAvailable === true && "validUsername"} ${isAvailable === false && "invalidUsername"}`}
          >
            <Input
              name="userName"
              type="text"
              placeholder="Digite o Nome do usuário"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

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
        <ActionButton type="submit">Cadastrar</ActionButton>
      </form>
      <Link
        className=" text-white text-sm  underline decoration-solid font-medium "
        to={"/login"}
      >
        Voltar para o login
      </Link>
    </>
  );
}

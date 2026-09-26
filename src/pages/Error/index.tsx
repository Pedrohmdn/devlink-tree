import {  useNavigate } from "react-router";
import ActionButton from "../../components/ActionButton";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-8xl font-bold mb-4">404</h2>
        <span className="text-xl font-medium block mb-6">
          Página não encontrada
        </span>
        <ActionButton onClick={() => navigate("/signup", { replace: true })}>
          Ir Para página de Cadastro
        </ActionButton>
      </div>
    </div>
  );
}

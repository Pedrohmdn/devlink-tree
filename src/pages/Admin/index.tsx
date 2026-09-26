import ActionButton from "../../components/ActionButton";
import { IoLink } from "react-icons/io5";
import Input from "../../components/Input";
import { useContext, useEffect, useState } from "react";
import LinkContainer from "../../components/LinkContainer";
import { FiTrash } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";

import { toast } from "react-toastify";
import InputLabel from "../../components/InputLabel";
import { UserContext } from "../../contexts/user";

export interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export default function Admin() {
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkBg, setLinkBg] = useState("#f1f1f1");
  const [linkColor, setLinkColor] = useState("#121212");
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [maxNameLength, setmaxNameLength] = useState<number>(82);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const linksRef = collection(db, "links");

    
    const queryRef = query(
      linksRef,
      where("uid", "==", user?.userId),
      orderBy("created", "asc"),
    );

    const unsub = onSnapshot(queryRef, (snapshot) => {
      let lista: LinkProps[] = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
      });
      setLinks(lista);
    });

    return () => {
      unsub();
    };
  }, [user?.userId]);

  async function handleRegister() {
    
    try {
      await addDoc(collection(db, "links"), {
        userName: user?.userName,
        uid: user?.userId,
        name: linkName,
        url: linkUrl,
        bg: linkBg,
        color: linkColor,
        created: new Date(),
      });

      toast.success("Link Cadastrado com Sucesso!");
      setLinkName("");
      setLinkUrl("");
    } catch (error) {
      toast.error("Erro ao cadastrar!");
      console.log(error);
    }
  }
  async function deleteLink(id: string) {
    const docRef = doc(db, "links", id);

    try {
      await deleteDoc(docRef);
      toast.success("Link excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir!");
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col gap-14 ">
      <form className="flex flex-col gap-4 w-full" action={handleRegister}>
        <div className="flex flex-col gap-2">
          <label htmlFor="linkName" className="text-white font-medium">
            Nome do link -{" "}
            <span className="text-sm">{`${linkName.length}/${maxNameLength}`}</span>
          </label>
          <Input
            type="text"
            required
            name="linkName"
            id="linkName"
            value={linkName}
            maxLength={maxNameLength}
            placeholder="Digite o nome do link"
            onChange={(e) => setLinkName(e.target.value)}
          />
        </div>
        <InputLabel htmlFor="linkUrl" labelText="URL do link">
          <Input
            type="url"
            required
            name="linkUrl"
            id="linkUrl"
            value={linkUrl}
            placeholder="Digite a url"
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </InputLabel>

        <div className="flex gap-10 items-center">
          <div className="flex gap-2 items-center">
            <label htmlFor="linkBg" className="text-white font-medium">
              Fundo do link
            </label>
            <input
              type="color"
              required
              name="linkBg"
              id="linkBg"
              value={linkBg}
              onChange={(e) => setLinkBg(e.target.value)}
              className="cursor-pointer "
            />
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="linkColor" className="text-white font-medium">
              Cor do link
            </label>

            <input
              type="color"
              required
              name="linkColor"
              id="linkColor"
              value={linkColor}
              onChange={(e) => setLinkColor(e.target.value)}
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-4 border-gray-100/25 border p-4 rounded-lg">
          <label className="text-white font-medium">
            Veja como está fincando:
          </label>
          <LinkContainer
            color={linkColor}
            background={linkBg}
            text={linkName !== "" ? linkName : "Saiba mais..."}
          />
        </div>
        <div className="mt-8">
          <ActionButton type="submit">
            Cadastrar
            <IoLink size={24} color="#fff" />
          </ActionButton>
        </div>
      </form>
      <div>
        <h2 className="text-white text-center text-2xl font-bold mb-6">
          Meus Links
        </h2>
        <div className="flex flex-col gap-3">
          {links.length === 0 ? (
            <span className="text-white text-center">
              Sem links cadastrados
            </span>
          ) : (
            links.map((link) => (
              <LinkContainer
                key={link.id}
                color={link.color}
                background={link.bg}
              >
                {link.name}
                <button
                  className="cursor-pointer bg-black p-1 rounded-sm border border-white "
                  onClick={() => deleteLink(link.id)}
                >
                  <FiTrash size={18} color="#fff" />
                </button>
              </LinkContainer>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

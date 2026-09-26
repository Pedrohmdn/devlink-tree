import { IoLink } from "react-icons/io5";
import ActionButton from "../../components/ActionButton";
import Input from "../../components/Input";
import InputLabel from "../../components/InputLabel";
import { useContext, useEffect, useState } from "react";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

import { UserContext } from "../../contexts/user";

export default function NetWorks() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function loadLinks() {
      const docRef = doc(db, "social", user?.userId as string);
      try {
        const snapshot = await getDoc(docRef);
        if (snapshot.data !== undefined) {
          setFacebook(snapshot.data()?.facebook);
          setInstagram(snapshot.data()?.instagram);
          setYoutube(snapshot.data()?.youtube);
        }
      } catch (error) {
        toast.error("Falha carregar os dados do usuário!");
        console.log(error);
      }
    }
    loadLinks();
  }, [user?.userId]);

  async function handleRegister() {
    try {
      await setDoc(doc(db, "social", user?.userId as string), {
        facebook: facebook,
        instagram: instagram,
        youtube: youtube,
      });

      toast.success("Links salvos com Sucesso!");
    } catch (error) {
      toast.error("Erro ao Salvar!");
      console.log(error);
    }
  }
  return (
    <div>
      <h1 className="text-white text-2xl text-center font-medium mb-8">
        Minha redes Sociais
      </h1>
      <form className="flex flex-col gap-4 w-full" action={handleRegister}>
        <InputLabel htmlFor="facebookLink" labelText="Link Facebook">
          <Input
            type="url"
            name="facebookLink"
            id="facebookLink"
            placeholder="Digite a url"
            value={facebook }
            onChange={(e) => setFacebook(e.target.value)}
          />
        </InputLabel>
        <InputLabel htmlFor="instagramLink" labelText="Link Instagram">
          <Input
            type="url"
            name="instagramLink"
            id="instagramLink"
            placeholder="Digite a url"
            value={instagram }
            onChange={(e) => setInstagram(e.target.value)}
          />
        </InputLabel>
        <InputLabel htmlFor="youtubeLink" labelText="Link Youtube">
          <Input
            type="url"
            name="youtubeLink"
            id="youtubeLink"
            placeholder="Digite a url"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </InputLabel>

        <div className="mt-8">
          <ActionButton type="submit">
            Salvar Links
            <IoLink size={24} color="#fff" />
          </ActionButton>
        </div>
      </form>
    </div>
  );
}

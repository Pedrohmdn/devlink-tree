import { useEffect, useState } from "react";
import LinkContainer from "../../components/LinkContainer";
import Social from "../../components/Social";
import {
  collection,
  orderBy,
  doc,
  where,
  getDocs,
  query,
  getDoc,
} from "firebase/firestore";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { db } from "../../services/firebaseConnection";
import type { LinkProps } from "../Admin";

import { useParams } from "react-router";

interface socialProps {
  facebook: string;
  instagram: string;
  youtube: string;
}
export default function Home() {
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [social, setSocial] = useState<socialProps>();
  const { userName } = useParams();

  useEffect(() => {
    async function loadLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(
        linksRef,
        where("userName", "==", userName),
        orderBy("created", "asc"),
      );
      try {
        const snapshot = await getDocs(queryRef);
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
      } catch (error) {
        console.error(error);
      }
    }

    loadLinks();
  }, [userName]);

  useEffect(() => {
    async function loadSocialLinks() {
      try {
        const docSnap = await getDoc(doc(db, "usernames", userName as string));
        const uid = docSnap.data()?.uid;
        const snapshot = await getDoc(doc(db, "social", uid));
        if (!snapshot.exists()) {
          return;
        }

        setSocial({
          facebook: snapshot.data()?.facebook,
          instagram: snapshot.data()?.instagram,
          youtube: snapshot.data()?.youtube,
        });
      } catch (error) {
        console.error(error);
      }
    }
    loadSocialLinks();
  }, [userName]);
  return (
    <main className="flex justify-center">
      <section className="py-4 flex flex-col items-center mt-20 gap-10 max-w-175 w-full  ">
        <div className="flex flex-col items-center gap-5 text-white">
          <h1 className="md:text-5xl text-3xl font-semibold">@{userName}</h1>
          <span className="text-gray-50 md:text-xl text-lg font-medium">
            Veja meus Links 👇
          </span>
        </div>
        <div className="flex flex-col gap-5 w-full text-center select-none cursor-pointer">
          {links.map((link) => (
            <LinkContainer
              url={link.url}
              key={link.id}
              color={link.color}
              background={link.bg}
            >
              {link.name}
            </LinkContainer>
          ))}

          <div className="flex gap-4 justify-center mt-1.5">
            {social && Object.keys(social).length > 0 && (
              <>
                <Social url={social.facebook}>
                  <FaFacebook size={35} color="#fff" />
                </Social>
                <Social url={social.instagram}>
                  <FaInstagram size={35} color="#fff" />
                </Social>
                <Social url={social.youtube}>
                  <FaYoutube size={35} color="#fff" />
                </Social>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { useTargets } from "./useTargets";
import CookieJarIndexer from "../utils/indexer/CookieJarIndexer";
import { parseAbiItem } from "abitype";
import { useLiveQuery } from "dexie-react-hooks";
import { useDHConnect } from "@daohaus/connect";
import { db } from "../utils/indexer";

const useIndexer = () => {
  const [indexer, setIndexer] = useState<CookieJarIndexer | undefined>();
  const addresses = useTargets();
  const { publicClient } = useDHConnect();

  useEffect(() => {
    const initIndexer = async () => {
      console.log("set up");
      // check if the indexer has not been initialized
      const indexer = new CookieJarIndexer(publicClient!);
      setIndexer(indexer);
    };

    if (publicClient && !indexer) {
      initIndexer();
    }
  }, []);

  useEffect(() => {
    if (addresses && indexer) {
      console.log("Registering initial subscriptions...");
      // Subscribe to Cookie Jar Factory
      indexer.subscribe(
        addresses?.COOKIEJAR_FACTORY_ADDRESS as `0x${string}`,
        parseAbiItem(
          "event SummonCookieJar(address cookieJar, bytes initializer, string details, string uid)"
        ),
        BigInt(addresses.START_BLOCK),
        "StoreCookieJar"
      );

      // Subscribe to Poster
      // indexer.subscribe(
      //   addresses?.POSTER_ADDRESS as `0x${string}`,
      //   Poster as Abi,
      //   "NewPost",
      //   BigInt(addresses.START_BLOCK)
      // );
    }
  }, [addresses, indexer]);

  const cookieJars = useLiveQuery(() => db.cookieJars.toArray());
  const cookies = useLiveQuery(() => db.cookies.toArray());

  // const getCookiesByJarReasontag = async (reasonTag: string) => {
  //   if (!indexer) return undefined;
  //   const db = indexer.storage.db;
  //   const cookies: Cookie[] | undefined = await db?.getAll("cookies");
  //   const filteredCookies = cookies?.filter(
  //     (cookie) => cookie?.reasonTag === reasonTag
  //   );
  //   console.log("FILTERED COOKIES: ", filteredCookies);
  //   return filteredCookies;
  // };

  // const getReasonByTag = async (tag: string) => {
  //   if (!indexer) return undefined;
  //   const db = indexer.storage.db;
  //   const cookies: PosterSchema[] | undefined = await db?.getAll("reasons");
  //   return cookies?.filter((reason) => reason?.tag === tag);
  // };

  return {
    indexer,
    client: publicClient,
    cookieJars,
    cookies,
  };
};

export { useIndexer };

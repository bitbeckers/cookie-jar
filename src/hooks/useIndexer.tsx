import { useEffect, useRef, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTargets } from "./useTargets";
import { Cookie, CookieJar } from "../utils/cookieJarHandlers";
import { handleEvent } from "../utils/eventHandler";
import CookieJarIndexer from "../utils/CookieJarIndexer";
import { PosterSchema } from "../utils/posterHandlers";
import { Poster, CookieJarFactory } from "../abis";
import { Abi } from "viem";

const useIndexer = () => {
  const { publicClient } = useDHConnect();
  const [indexer, setIndexer] = useState<CookieJarIndexer | undefined>();
  const addresses = useTargets();
  const initialized = useRef(false); // add a useRef hook to keep track of whether the indexer has been initialized

  const storageEntities = ["cookieJars", "cookies", "reasons"];

  useEffect(() => {
    const initIndexer = async () => {
      if (publicClient && !initialized.current) {
        // check if the indexer has not been initialized
        const indexer = new CookieJarIndexer(
          storageEntities,
          publicClient,
          handleEvent
        );
        await indexer.init();
        setIndexer(indexer);
        initialized.current = true; // set initialized to true
      }
    };

    initIndexer();
  }, [publicClient]);

  useEffect(() => {
    if (addresses && indexer) {
      // Subscribe to Cookie Jar Factory
      indexer.subscribe(
        addresses?.COOKIEJAR_FACTORY_ADDRESS,
        CookieJarFactory as Abi,
        addresses.CHAIN_ID,
        addresses.START_BLOCK
      );

      // Subscribe to Poster
      indexer.subscribe(
        addresses?.POSTER_ADDRESS,
        Poster as Abi,
        addresses.CHAIN_ID,
        addresses.START_BLOCK
      );
    }
  }, [addresses, indexer]);

  const getJars = async () => {
    if (!indexer) return;
    const db = indexer.storage.db;
    return db?.getAll("cookieJars") as Promise<CookieJar[]>;
  };

  const getJarById = async (jarId: string) => {
    if (!indexer) return;
    const db = indexer.storage.db;
    const jars: CookieJar[] | undefined = await db?.getAll("cookieJars");
    return jars?.filter((jar) => jar?.id === jarId);
  };

  const getJarByAddress = async (address: string) => {
    if (!indexer) return;
    const db = indexer.storage.db;
    const jars: CookieJar[] | undefined = await db?.getAll("cookieJars");
    return jars?.filter(
      (jar) => jar?.address.toLowerCase() === address.toLowerCase()
    );
  };

  const getCookies = async () => {
    if (!indexer) return;
    const db = indexer.storage.db;
    return db?.getAll("cookies") as Promise<Cookie[]>;
  };

  const getCookiesByJarId = async (jarId: string) => {
    if (!indexer) return undefined;
    const db = indexer.storage.db;
    const cookies: Cookie[] | undefined = await db?.getAll("cookies");
    return cookies?.filter((cookie) => cookie.jarUid === jarId);
  };

  const getCookiesByJarReasontag = async (reasonTag: string) => {
    if (!indexer) return undefined;
    const db = indexer.storage.db;
    const cookies: Cookie[] | undefined = await db?.getAll("cookies");
    const filteredCookies = cookies?.filter(
      (cookie) => cookie?.reasonTag === reasonTag
    );
    console.log("FILTERED COOKIES: ", filteredCookies);
    return filteredCookies;
  };

  const getReasonByTag = async (tag: string) => {
    if (!indexer) return undefined;
    const db = indexer.storage.db;
    const cookies: PosterSchema[] | undefined = await db?.getAll("reasons");
    return cookies?.filter((reason) => reason?.tag === tag);
  };

  return {
    indexer,
    getJars,
    getJarById,
    getJarByAddress,
    getCookies,
    getCookiesByJarId,
    getCookiesByJarReasontag,
    getReasonByTag,
  };
};

export { useIndexer };

import { createIndexer, IdbStorage } from "chainsauce-web";
import type { Indexer } from "chainsauce-web";

import FactoryABI from "../abis/CookieJarFactory.json";
import PosterABI from "../abis/Poster.json";
import { useEffect, useMemo, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTargets } from "./useTargets";
import { CookieJar } from "../utils/cookieJarHandlers";
import { Cookie, handleEvent } from "../utils/eventHandler";

const useIndexer = () => {
  const { provider } = useDHConnect();
  const [indexer, setIndexer] = useState<Indexer<IdbStorage> | undefined>();
  const addresses = useTargets();

  const storage = useMemo(() => new IdbStorage(["cookieJars", "cookies"]), []);

  const createIndexerMemoized = useMemo(() => {
    if (!provider || !storage) return;
    return async () => {
      const indexer = await createIndexer(provider, storage, handleEvent);
      setIndexer(indexer);
    };
  }, [provider, storage]);

  // Effect hook to create indexer
  useEffect(() => {
    if (!createIndexerMemoized) return;
    createIndexerMemoized();
  }, [createIndexerMemoized]);

  console.log(indexer);

  if (addresses && indexer) {
    indexer.subscribe(
      addresses?.COOKIEJAR_FACTORY_ADDRESS,
      FactoryABI,
      28000000
    );

    indexer.subscribe(addresses?.POSTER_ADDRESS, PosterABI, 28000000);
  }

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

  const getCookies = async () => {
    if (!indexer) return;
    const db = indexer.storage.db;
    return db?.getAll("cookies") as Promise<Partial<Cookie>[]>;
  };

  const getCookiesByJarId = async (jarId: string) => {
    if (!indexer) return undefined;
    const db = indexer.storage.db;
    const cookies: Partial<Cookie>[] | undefined = await db?.getAll("cookies");
    return cookies?.filter((cookie) => cookie?.jarUid === jarId);
  };

  return {
    indexer,
    getJars,
    getJarById,
    getCookies,
    getCookiesByJarId,
  };
};

export { useIndexer };

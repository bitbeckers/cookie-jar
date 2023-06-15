import { createIndexer, IdbStorage } from "chainsauce-web";
import type { Indexer } from "chainsauce-web";

import FactoryABI from "../abis/CookieJarFactory.json";
import PosterABI from "../abis/Poster.json";
import { useEffect, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTargets } from "./useTargets";
import { CookieJar } from "../utils/cookieJarHandlers";
import { handleEvent } from "../utils/eventHandler";

const useIndexer = () => {
  const { provider } = useDHConnect();
  const [indexer, setIndexer] = useState<Indexer<IdbStorage> | undefined>();
  const addresses = useTargets();

  const storage = new IdbStorage(["cookieJars", "cookies"]);

  // Effect hook to create indexer
  useEffect(() => {
    if (!provider || !storage) return;
    const init = async () => {
      const indexer = await createIndexer(provider, storage, handleEvent);
      setIndexer(indexer);
    };

    init();
  }, [provider]);

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

  // Susbscribe to events with the contract address and ABI
  //TODO dynamic config loading

  return { indexer: indexer, getJars };
};

export { useIndexer };

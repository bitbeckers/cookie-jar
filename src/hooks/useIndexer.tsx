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
  const { publicClient, chainId } = useDHConnect();

  useEffect(() => {
    const initIndexer = async (chainId: number) => {
      console.log("Initializing cookie jar indexer...");
      // check if the indexer has not been initialized
      const indexer = new CookieJarIndexer(publicClient!);
      setIndexer(indexer);

      // Subscribe to Poster
      //TODO better poster state management
      if (!(await db.keyvals.get(`posterState-${chainId}`)) && addresses) {
        await db.keyvals.add(
          { lastBlock: BigInt(addresses.START_BLOCK) },
          `posterState-${chainId}`
        );
      }
    };

    if (publicClient && !indexer && Number(chainId) > 0) {
      initIndexer(Number(chainId));
    }
  }, []);

  useEffect(() => {
    if (addresses && indexer) {
      const chainId = Number(addresses?.CHAIN_ID);
      if (chainId === 5 || chainId === 100) {
        console.log("Registering initial subscriptions...");
        // Subscribe to Cookie Jar Factory
        indexer.subscribe(
          chainId,
          addresses?.COOKIEJAR_FACTORY_ADDRESS as `0x${string}`,
          parseAbiItem(
            "event SummonCookieJar(address cookieJar, bytes initializer, string details, string uid)"
          ),
          BigInt(addresses.START_BLOCK),
          "StoreCookieJar"
        );
      }
    }
  }, [addresses, indexer, publicClient]);

  return {
    indexer,
    client: publicClient,
  };
};

export { useIndexer };

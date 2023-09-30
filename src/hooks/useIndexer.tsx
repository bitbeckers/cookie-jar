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

      // Subscribe to Poster
      if (!(await db.keyvals.get("posterState")) && addresses) {
        await db.keyvals.add(
          { lastBlock: BigInt(addresses.START_BLOCK) },
          "posterState"
        );
      }
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
    }
  }, [addresses, indexer]);

  const cookieJars = useLiveQuery(() => db.cookieJars.toArray());
  const cookies = useLiveQuery(() => db.cookies.toArray());

  return {
    indexer,
    client: publicClient,
    cookieJars,
    cookies,
  };
};

export { useIndexer };

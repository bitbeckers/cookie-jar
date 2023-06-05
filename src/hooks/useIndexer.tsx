import { createIndexer, IdbStorage, Event } from "chainsauce-web";
import type { Indexer } from "chainsauce-web";

import FactoryABI from "../abis/CookieJarFactory.json";
import PosterABI from "../abis/Poster.json";
import { useEffect, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTargets } from "./useTargets";
import {
  CookieJar,
  parseGiveCookieEvent,
  parseSummonEvent,
} from "../utils/cookieJarHandlers";
import { parseNewPostEvent } from "../utils/posterHandlers";

async function handleEvent(indexer: Indexer<IdbStorage>, event: Event) {
  const db = indexer.storage.db;

  if (!db) {
    console.error("No db");
    return;
  }

  console.log("Handling event");
  let parsedEvent;

  switch (event.name) {
    case "SummonCookieJar":
      parsedEvent = parseSummonEvent(event);
      if (!parsedEvent) {
        console.error("Failed to parse event", event);
        break;
      }

      // address, details, initializer
      // TODO ID mix of chain + uid
      await db.add("cookieJars", parsedEvent, parsedEvent.id);

      console.log("Stored cookiejar");

      break;
    case "GiveCookies":
      parsedEvent = parseGiveCookieEvent(event);

      if (!parsedEvent || !parsedEvent.uid) {
        console.error("Failed to parse event", event);
        break;
      }

      let _cookie = await db.get("cookies", parsedEvent.uid);

      if (!_cookie) {
        await db.add("cookies", parsedEvent, parsedEvent.uid);
      } else {
        await db.add(
          "cookies",
          { ..._cookie, ...parsedEvent },
          parsedEvent.uid
        );
      }

      console.log(`Stored cookie ${parsedEvent.uid}: `, parsedEvent);

    case "NewPost":
      parsedEvent = parseNewPostEvent(event);
      if (!parsedEvent || !parsedEvent.jarUid || !parsedEvent.cookieUid) {
        console.error("Failed to parse event", event);
        break;
      }

      let cookie = await db.get("cookies", parsedEvent.cookieUid);

      // TODO better checking on updating values
      if (!cookie) {
        await db.add("cookies", parsedEvent, parsedEvent.cookieUid);
      } else {
        await db.add(
          "cookies",
          { ...cookie, ...parsedEvent },
          parsedEvent.cookieUid
        );
      }

      console.log(`Stored cookie ${parsedEvent.cookieUid}: `, parsedEvent);

      break;
    default:
      console.log(`Unhandled event: `, event);
      break;
  }

  console.log("event", event);
}

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
      FactoryABI.abi,
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

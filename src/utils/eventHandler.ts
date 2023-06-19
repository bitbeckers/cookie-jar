import { IdbStorage, Event, Indexer } from "chainsauce-web";
import {
  parseSummonEvent,
  parseGiveCookieEvent,
  GiveCookieEvent,
  CookieJar,
} from "./cookieJarHandlers";
import { PosterSchema, parseNewPostEvent } from "./posterHandlers";
import COOKIEJAR_CORE_ABI from "../abis/CookieJarCore.json";

export type Cookie = {
  cookieGiver: string;
  cookieMonster: string;
  jarUid: string;
  cookieUid: string;
  reasonTag: string;
  amount: string;
};

const storeOrUpdateCookie = async (
  storage: IdbStorage,
  event: GiveCookieEvent
) => {
  if (!storage.db) {
    console.error("No storage");
    return;
  }

  try {
    console.log("Storing cookie", event);
    await storage.db.add("cookies", event, event.cookieUid);

    console.log(`Stored cookie ${event}`);
  } catch (e) {
    console.error("Failed to store cookie", e);
  }
};

const storeCookieJar = async (
  indexer: Indexer<IdbStorage>,
  cookieJar: CookieJar,
  blockNumber: number
) => {
  if (!indexer.storage.db) {
    console.error("No storage");
    return;
  }

  const {
    storage: { db },
  } = indexer;

  try {
    await db
      .add("cookieJars", cookieJar, cookieJar.id)
      .then(() =>
        indexer.subscribe(
          cookieJar.address,
          COOKIEJAR_CORE_ABI,
          "gnosis",
          blockNumber
        )
      );

    console.log(`Stored cookieJar ${cookieJar.id}`);
  } catch (e) {
    console.error("Failed to store cookie", e);
  }
};

const storeReason = async (
  indexer: Indexer<IdbStorage>,
  post: PosterSchema
) => {
  if (!indexer.storage.db) {
    console.error("No storage");
    return;
  }

  const {
    storage: { db },
  } = indexer;

  console.log("Storing reason", post);

  try {
    await db.add("reasons", post, post.tag);

    console.log(`Stored reason ${post.tag}`);
  } catch (e) {
    console.error("Failed to store reason", e);
  }
};

const handleEvent = async (indexer: Indexer<IdbStorage>, event: Event) => {
  console.log("Handling event");

  switch (event.name) {
    case "SummonCookieJar":
      const parsedSummonEvent = parseSummonEvent(event);
      if (!parsedSummonEvent) {
        console.error("Failed to parse event", event);
        break;
      }

      storeCookieJar(indexer, parsedSummonEvent, event.blockNumber);

      break;
    case "GiveCookie":
      const parsedGiveCookieEvent = await parseGiveCookieEvent(indexer, event);

      if (!parsedGiveCookieEvent || !parsedGiveCookieEvent.cookieUid) {
        console.error("Failed to parse event", event);
        break;
      }

      const db = indexer.storage.db;
      const jar = await db
        ?.getAll("cookieJars")
        ?.then((jars) =>
          jars.filter(
            (jar) => jar?.address.toLowerCase() === event.address.toLowerCase()
          )
        );

      storeOrUpdateCookie(indexer.storage, {
        ...parsedGiveCookieEvent,
        jarUid: jar?.[0]?.id,
      });
      break;

    case "NewPost":
      const parsedPosterEvent = await parseNewPostEvent(indexer, event);
      if (!parsedPosterEvent) {
        console.error("Failed to parse event", event);
        break;
      }

      if (parsedPosterEvent.table === "reason") {
        storeReason(indexer, parsedPosterEvent);
      }

      if (parsedPosterEvent.table === "assess") {
        console.log("Received assess event", parsedPosterEvent);
      }

      break;
    default:
      console.log(`Unhandled event: `, event);
      break;
  }
};

export { handleEvent };

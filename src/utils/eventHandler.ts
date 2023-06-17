import { IdbStorage, Event, Indexer } from "chainsauce-web";
import {
  parseSummonEvent,
  parseGiveCookieEvent,
  GiveCookieEvent,
  CookieJar,
} from "./cookieJarHandlers";
import { ReasonEvent, parseNewPostEvent } from "./posterHandlers";
import COOKIEJAR_CORE_ABI from "../abis/CookieJarCore.json";

export type Cookie = {
  cookieGiver: string;
  cookieMonster: string;
  jarUid: string;
  cookieUid: string;
  amount: string;
  reason: string;
};

const storeOrUpdateCookie = async (
  storage: IdbStorage,
  event: GiveCookieEvent | ReasonEvent
) => {
  if (!storage.db) {
    console.error("No storage");
    return;
  }

  const _cookie = (await storage.db.get(
    "cookies",
    event.cookieUid
  )) as Partial<Cookie>;

  try {
    if (!_cookie) {
      await storage.db.add("cookies", event, event.cookieUid);
    } else {
      await storage.db.add(
        "cookies",
        { ..._cookie, ...event } as Partial<Cookie>,
        event.cookieUid
      );
    }

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

const handleEvent = async (indexer: Indexer<IdbStorage>, event: Event) => {
  console.log("Handling event");
  let parsedEvent;

  switch (event.name) {
    case "SummonCookieJar":
      parsedEvent = parseSummonEvent(event);
      if (!parsedEvent) {
        console.error("Failed to parse event", event);
        break;
      }

      storeCookieJar(indexer, parsedEvent, event.blockNumber);

      break;
    case "GiveCookie":
      parsedEvent = parseGiveCookieEvent(event);

      if (!parsedEvent || !parsedEvent.cookieUid) {
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
        ...parsedEvent,
        jarUid: jar?.[0]?.id,
      });
      break;

    case "NewPost":
      parsedEvent = parseNewPostEvent(event);
      if (!parsedEvent) {
        console.error("Failed to parse event", event);
        break;
      }

      if (parsedEvent.type === "reason") {
        storeOrUpdateCookie(indexer.storage, parsedEvent);
      }

      if (parsedEvent.type === "assess") {
        console.log("Received assess event", parsedEvent);
      }

      break;
    default:
      console.log(`Unhandled event: `, event);
      break;
  }
};

export { handleEvent };

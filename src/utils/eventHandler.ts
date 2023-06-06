import { IdbStorage, Event, Indexer } from "chainsauce-web";
import {
  parseSummonEvent,
  parseGiveCookieEvent,
  GiveCookieEvent,
  CookieJar,
} from "./cookieJarHandlers";
import { ReasonEvent, parseNewPostEvent } from "./posterHandlers";

type Cookie = {
  cookieGiver: string;
  cookieMonster: string;
  jarUid: string;
  cookieUid: string;
  amount: string;
  reason?: string;
};

const storeOrUpdateCookie = async (
  storage: IdbStorage,
  event: GiveCookieEvent | ReasonEvent
) => {
  if (!storage.db) {
    console.error("No storage");
    return;
  }

  const _cookie = await storage.db.get("cookies", event.cookieUid);

  try {
    if (!_cookie) {
      await storage.db.add("cookies", event, event.cookieUid);
    } else {
      await storage.db.add(
        "cookies",
        { ..._cookie, ...event },
        event.cookieUid
      );
    }

    console.log(`Stored cookie ${event.cookieUid}`);
  } catch (e) {
    console.error("Failed to store cookie", e);
  }
};

const storeCookieJar = async (storage: IdbStorage, cookieJar: CookieJar) => {
  if (!storage.db) {
    console.error("No storage");
    return;
  }

  // address, details, initializer
  // TODO ID mix of chain + uid
  try {
    await storage.db.add("cookieJars", cookieJar, cookieJar.id);

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

      storeCookieJar(indexer.storage, parsedEvent);

      break;
    case "GiveCookies":
      parsedEvent = parseGiveCookieEvent(event);

      if (!parsedEvent || !parsedEvent.cookieUid) {
        console.error("Failed to parse event", event);
        break;
      }

      storeOrUpdateCookie(indexer.storage, parsedEvent);
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

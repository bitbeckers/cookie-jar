import { Initializer } from "../hooks/useCookieJarFactory";
import { Event } from "chainsauce-web";

const COOKIE_JAR_TAG = "CookieJar";

export type SummonEvent = {
  id: string;
  type: string;
  address: string;
  initializer?: Initializer;
};

export type DetailsSchema = {
  type: string;
  name: string;
  description?: string;
  link?: string;
};

export type GiveCookieEvent = {
  cookieMonster: string;
  _uid: string;
  amount?: string;
  reason?: string;
};

// From contract docs
// The post claim reason event is used to store a reason for a claim made by a user. The event has the following schema:

// ```json
// {
//   "tag": "CookieJar.<jar_uid>.reason.<cookie_uid>",
//   "content": "...reason..."
// }
// ```

type PosterTags = {
  type: string;
  link?: string;
};

export type GiveCookieReason = PosterTags & {
  jarUid: string;
  cookieUid: string;
  reason?: string;
};

export type AssessCookieReason = PosterTags & {
  jarUid: string;
  cookieUid: string;
  description: string;
};

const processPosterTag = (tag: string) => {
  const parts = tag.split(".");
  if (parts.length !== 4) {
    return undefined;
  }
  const [startTag, jarUid, type, cookieUid] = parts;
  if (
    startTag !== COOKIE_JAR_TAG ||
    !jarUid ||
    !type ||
    !cookieUid ||
    type !== "reason"
  ) {
    return undefined;
  }

  return {
    type,
    jarUid,
    cookieUid,
  } as Partial<GiveCookieReason>;
};

const parseReasonEvent = (event: Event) => {
  const { content } = event.args;

  //try to parse content to ReasonSchema
  let _content: Partial<GiveCookieReason>;
  try {
    _content = JSON.parse(content);
  } catch (e) {
    console.warn("Could not parse content from event.");
    console.log(content);
    return;
  }

  return _content;
};

export const parseNewPostEvent = (event: Event) => {
  // NewPost (index_topic_1 address user, string content, index_topic_2 string tag)
  const { tag } = event.args;
  console.log("Event: ", event);
  if (!isText(tag)) {
    console.log("Not a text tag.");
    return undefined;
  }

  if (!tag.indexOf(COOKIE_JAR_TAG)) {
    console.log("Not a cookie jar tag.");
    return undefined;
  }

  const parsedTag = processPosterTag(tag);

  if (!parsedTag) {
    return undefined;
  }

  if (parsedTag.type === "reason") {
    const reason = parseReasonEvent(event);
    if (reason?.cookieUid && reason?.jarUid && parsedTag?.type) {
      return { ...parsedTag, ...reason } as Partial<GiveCookieReason>;
    }
  }

  return undefined;
};

function isText(data: any): data is string {
  return typeof data === "string";
}

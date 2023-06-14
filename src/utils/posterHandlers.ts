import { Initializer } from "../hooks/useCookieJarFactory";
import { Event } from "chainsauce-web";

const COOKIE_JAR_TAG = "CookieJar";

export type SummonEvent = {
  id: string;
  type: string;
  address: string;
  initializer?: Initializer;
};

export type CookieJarDetailsSchema = {
  type: string;
  name: string;
  description?: string;
  link?: string;
};

export type GiveCookieEvent = {
  cookieMonster: string;
  cookieUid: string;
  amount?: string;
  reason?: string;
};

interface Tag {
  jarUid: string;
  cookieUid: string;
  type: string;
}

type ReasonTag = Tag & {
  type: "reason";
};

type AssessTag = Tag & {
  type: "assess";
};

type ReasonSchema = {
  reason: string;
  link: string;
};

type AssessSchema = {
  rating: "UP" | "DOWN";
  sender: `0x${string}`;
};

export interface ReasonEvent extends ReasonTag, ReasonSchema {
  user: string;
}

export interface AssessEvent extends AssessTag, AssessSchema {
  user: string;
}

export const parseNewPostEvent = (event: Event) => {
  // NewPost (index_topic_1 address user, string content, index_topic_2 string tag)
  const { tag, content, user } = event.args;
  console.log("Event: ", event);

  if (!isText(tag)) {
    console.log("Not a valid tag.");
    return undefined;
  }

  if (tag.startsWith(COOKIE_JAR_TAG) || !isText(tag)) {
    console.log("Not a valid tag.");
    return undefined;
  }

  const parsedTag = processPosterTag(tag);

  if (!parsedTag) {
    return undefined;
  }

  const parsedContent = processPosterContent(content, parsedTag);

  if (!parsedContent) {
    return undefined;
  }

  if (parsedTag.type === "reason" && isReasonContent(parsedContent)) {
    return {
      user,
      ...parsedTag,
      ...parsedContent,
    } as ReasonEvent;
  }

  if (parsedTag.type === "assess" && isAssessContent(parsedContent)) {
    return {
      user,
      ...parsedTag,
      ...parsedContent,
    } as AssessEvent;
  }

  return undefined;
};

const isReasonContent = (content: any): content is ReasonSchema =>
  content.reason && content.link;

const isAssessContent = (content: any): content is AssessSchema =>
  content.rating && content.sender;

const isReasonTag = (tag: any): tag is ReasonTag => {
  const parts = tag.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const [_, jarUid, type, cookieUid] = parts;

  if (type !== "reason") {
    return false;
  }

  return jarUid && type && cookieUid;
};

const isAssessTag = (tag: any): tag is AssessTag => {
  const parts = tag.split(".");
  if (parts.length !== 4) {
    return false;
  }

  const [_, jarUid, type, cookieUid] = parts;

  if (type !== "assess") {
    return false;
  }

  return jarUid && type && cookieUid;
};

const processPosterTag = (tag: string) => {
  const parts = tag.split(".");
  if (parts.length !== 4) {
    return undefined;
  }
  const [startTag, jarUid, type, cookieUid] = parts;

  if (startTag !== COOKIE_JAR_TAG) {
    return undefined;
  }

  if (isReasonTag(tag)) {
    return {
      type,
      jarUid,
      cookieUid,
    } as ReasonTag;
  }

  if (isAssessTag(tag)) {
    return {
      type,
      jarUid,
      cookieUid,
    } as AssessTag;
  }

  return undefined;
};

const processPosterContent = (content: string, tag: Tag) => {
  switch (tag.type) {
    case "reason":
      return processReasonContent(content);
    case "assess":
      return processAssessContent(content);
    default:
      return undefined;
  }
};

const processReasonContent = (content: string) => {
  let reasonDetails: { reason: string; link: string };

  try {
    reasonDetails = JSON.parse(content);
    return reasonDetails as ReasonSchema;
  } catch (e) {
    console.warn("Could not reason details from event.");
    console.log(content);
    return undefined;
  }
};

const processAssessContent = (content: string) => {
  const parts = content.split(" ");
  if (parts.length !== 2) {
    return undefined;
  }

  const [rating, sender] = parts as ["UP" | "DOWN", `0x${string}`];

  return {
    rating,
    sender,
  } as AssessSchema;
};

function isText(data: any): data is string {
  return typeof data === "string";
}

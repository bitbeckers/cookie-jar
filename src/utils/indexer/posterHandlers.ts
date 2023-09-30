import { db } from "./db";
import { hexToString, trim } from "viem";

type PosterEventContent = {
  title: string;
  user: string;
  receiver: string;
  description: string;
  link: string;
  table: string;
  queryType: string;
};

export type PosterSchema = {
  table: "reason" | "assess";
  title: string;
  description: string;
  link: string;
  user: string;
  receiver: string;
  tag: string;
};

export const postHandler = async (
  user: string,
  tag: string,
  data: string,
  publicClient: any
) => {
  const parsedContent = await parseNewPostEvent(user, tag, data);
  console.log("Parsed Content: ", parsedContent);
  if (!parsedContent) {
    return;
  }
  await db.reasons.put(parsedContent, parsedContent.tag);
};

export const parseNewPostEvent = async (
  user: string,
  tag: string,
  content: string
) => {
  // NewPost (index_topic_1 address user, string content, index_topic_2 string tag)
  const parsedContent = processPosterContent(content, tag);

  if (!parsedContent) {
    return undefined;
  }

  console.log("Parsed Content: ", parsedContent);
  return parsedContent;
};

// emit NewPost(msg.sender, content, tag);
const processPosterContent = (content: string, tag: string) => {
  if (isReason(content)) {
    return processReasonContent(content, tag);
  }

  if (isAssessment(content)) {
    return processAssessContent(content, tag);
  }
};

const processReasonContent = (content: string, tag: string): PosterSchema => {
  const parsedContent: PosterEventContent = JSON.parse(content);

  return {
    table: "reason",
    title: parsedContent.title,
    description: parsedContent.description,
    link: parsedContent.link,
    user: parsedContent.user,
    receiver: parsedContent.receiver,
    tag: tag,
  };
};

const processAssessContent = (content: string, tag: string): PosterSchema => {
  const parsedContent: PosterEventContent = JSON.parse(content);

  return {
    table: "assess",
    title: parsedContent.title,
    description: parsedContent.description,
    link: parsedContent.link,
    user: parsedContent.user,
    receiver: parsedContent.receiver,
    tag: tag,
  };
};

const isReason = (content: any): content is PosterSchema => {
  const parsedContent = JSON.parse(content);

  return parsedContent.table === "reason";
};

const isAssessment = (content: any): content is PosterSchema => {
  const parsedContent = JSON.parse(content);

  return parsedContent.table === "assess";
};

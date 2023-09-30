// type PosterEventContent = {
//   title: string;
//   user: string;
//   receiver: string;
//   description: string;
//   link: string;
//   table: string;
//   queryType: string;
// };

// export type PosterSchema = {
//   table: "reason" | "assess";
//   name: string;
//   description?: string;
//   link?: string;
//   user?: string;
//   receiver?: string;
//   tag: string;
// };

// export const parseNewPostEvent = async (event: Event) => {
//   // NewPost (index_topic_1 address user, string content, index_topic_2 string tag)
//   const { tag, content } = event.args;
//   console.log("Event: ", event);

//   const cookieJar = await indexer.storage.db
//     ?.getAll("cookieJars")
//     ?.then((jars) =>
//       jars.filter(
//         (jar) => jar?.address.toLowerCase() === event.address.toLowerCase()
//       )
//     );

//   if (!cookieJar) {
//     console.log("CookieJar for event not found.");
//     return undefined;
//   }

//   const parsedContent = processPosterContent(content, tag.hash);

//   if (!parsedContent) {
//     return undefined;
//   }

//   console.log("Parsed Content: ", parsedContent);
//   return parsedContent;
// };

// // emit NewPost(msg.sender, content, tag);
// const processPosterContent = (content: string, tag: string) => {
//   if (isReason(content)) {
//     return processReasonContent(content, tag);
//   }

//   if (isAssessment(content)) {
//     return processAssessContent(content, tag);
//   }
// };

// const processReasonContent = (content: string, tag: string): PosterSchema => {
//   const parsedContent: PosterEventContent = JSON.parse(content);

//   return {
//     table: "reason",
//     name: parsedContent.title,
//     description: parsedContent.description,
//     link: parsedContent.link,
//     user: parsedContent.user,
//     receiver: parsedContent.receiver,
//     tag: tag,
//   };
// };

// const processAssessContent = (content: string, tag: string): PosterSchema => {
//   const parsedContent: PosterEventContent = JSON.parse(content);

//   return {
//     table: "assess",
//     name: parsedContent.title,
//     description: parsedContent.description,
//     link: parsedContent.link,
//     user: parsedContent.user,
//     receiver: parsedContent.receiver,
//     tag: tag,
//   };
// };

// const isReason = (content: any): content is PosterSchema => {
//   const parsedContent: PosterEventContent = JSON.parse(content);

//   return parsedContent.table === "reason";
// };

// const isAssessment = (content: any): content is PosterSchema => {
//   const parsedContent: PosterEventContent = JSON.parse(content);

//   return parsedContent.table === "assess";
// };

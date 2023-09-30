// import { parseAbiParameters } from "abitype";
// import { keccak256, stringToBytes, decodeAbiParameters } from "viem";

// const calculateReasonTag = async (
//   indexer: Indexer<IdbStorage>,
//   event: Event
// ) => {
//   const cookieJar = await indexer.storage.db
//     ?.getAll<"cookieJars">("cookieJars")
//     ?.then(
//       (jars) =>
//         jars.filter(
//           (jar) => jar?.address.toLowerCase() === event.address.toLowerCase()
//         ) as CookieJar[]
//     );

//   if (!cookieJar) {
//     console.error("Could not find cookieJar for event", event);
//     return "";
//   }

//   const reasonTag = keccak256(
//     stringToBytes(`CookieJar.${cookieJar[0].id}.reason.${event.args._uid}`)
//   );

//   console.log(
//     `Calculated reasonTag: ${reasonTag} for cookie ${event.args._uid}`
//   );
//   return reasonTag;
// };

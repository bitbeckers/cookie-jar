import { Initializer, ListInitializer } from "../hooks/useCookieJarFactory";
import { ethers, utils } from "ethers";
import { Event, IdbStorage, Indexer } from "chainsauce-web";
import { useIndexer } from "../hooks/useIndexer";
import { useDHConnect } from "@daohaus/connect";

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
  cookieGiver: string;
  cookieMonster: string;
  cookieUid: string;
  jarUid: string;
  reasonTag?: string;
  amount?: string;
  reason?: string;
  link?: string;
};

export type CookieJar = DetailsSchema & {
  id: string;
  address: string;
  initializer?: Initializer;
};

const calculateReasonTag = async (
  indexer: Indexer<IdbStorage>,
  event: Event
) => {
  const cookieJar = await indexer.storage.db
    ?.getAll("cookieJars")
    ?.then((jars) =>
      jars.filter(
        (jar) => jar?.address.toLowerCase() === event.address.toLowerCase()
      )
    );

  if (!cookieJar) {
    console.error("Could not find cookieJar for event", event);
    return "";
  }

  const reasonTag = ethers.utils.keccak256(
    utils.toUtf8Bytes(`CookieJar.${cookieJar[0].id}.reason.${event.args._uid}`)
  );

  console.log(
    `Calculated reasonTag: ${reasonTag} for cookie ${event.args._uid}`
  );
  return reasonTag;
};

export const parseGiveCookieEvent = async (
  indexer: Indexer<IdbStorage>,
  event: Event
) => {
  // event GiveCookie(address indexed cookieMonster, uint256 amount, string _uid);
  const { cookieMonster, amount, _uid } = event.args;
  console.log("Event: ", event);
  console.log("Found cookieMonster: ", cookieMonster);
  console.log("Found amount: ", amount);
  console.log("Found _uid: ", _uid);

  const { provider } = indexer;

  const tx = await provider.getTransaction(event.transactionHash);

  return {
    cookieGiver: tx.from,
    cookieMonster,
    reasonTag: await calculateReasonTag(indexer, event),
    amount,
    cookieUid: _uid,
  } as GiveCookieEvent;
};

export const parseSummonEvent = (event: Event) => {
  // cookieJar, initializer, details, uid
  const { cookieJar, initializer, details, uid } = event.args;
  console.log("Event: ", event);
  let _details: DetailsSchema;

  // Try to parse details from event to DetailsSchema
  try {
    _details = JSON.parse(details);
  } catch (e) {
    console.warn("Could not parse details from event.");
    console.log(details);
    return;
  }

  let initParams: Initializer;

  switch (_details.type) {
    case "6551":
      console.log("Found 6551 initializer");
      const iface = new ethers.utils.Interface(["function setUp(bytes)"]);
      const decoded = iface.decodeFunctionData("setUp(bytes)", initializer);
      const decodedSetUp = ethers.utils.defaultAbiCoder.decode(
        ["address", "uint256", "uint256", "address", "address[]"],
        decoded[0]
      );

      console.log("Decoded", decodedSetUp);
      initParams = {
        safeTarget: decodedSetUp[0],
        periodLength: decodedSetUp[1],
        cookieAmount: decodedSetUp[2],
        cookieToken: decodedSetUp[3],
        allowList: decodedSetUp[4],
      } as ListInitializer;

      return {
        ..._details,
        id: uid,
        address: cookieJar,
        initializer: initParams,
      } as CookieJar;
    case "BAAL":
      console.log("Found BAAL initializer");

      break;
    case "ERC20":
      console.log("Found ERC20 initializer");

      break;
    default:
      console.log("Unknown jar type");
      return undefined;
  }
};

import { parseAbi, parseAbiItem, parseAbiParameters } from "abitype";
import { Cookie, CookieJar, db } from "./db";
import {
  Log,
  decodeAbiParameters,
  decodeFunctionData,
  PublicClient,
  stringToBytes,
  keccak256,
} from "viem";

export type EventHandlers = "StoreCookieJar" | "StoreCookie";
type SummonLog = {
  cookieJar: `0x${string}`;
  initializer: `0x${string}`;
  details: unknown;
  uid: string;
};

type GiveCookieLog = {
  cookieMonster: string;
  _uid: string;
  amount: bigint;
};

const hasArgs = (obj: unknown): obj is { args: unknown } => {
  return typeof obj === "object" && obj !== null && "args" in obj;
};

export type Details = {
  type: string;
  name: string;
  description: string;
  link: string;
};

const isSummonLog = (obj: unknown): obj is SummonLog => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "cookieJar" in obj &&
    "initializer" in obj &&
    "details" in obj &&
    "uid" in obj
  );
};

const isGiveCookieLog = (obj: unknown): obj is GiveCookieLog => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "cookieMonster" in obj &&
    "_uid" in obj &&
    "amount" in obj
  );
};

const storeCookieJar = async (
  summonCookieJarLog: Log,
  publicClient: PublicClient
) => {
  if (!hasArgs(summonCookieJarLog)) {
    console.error("Invalid log");
    return;
  }

  if (!isSummonLog(summonCookieJarLog.args)) {
    console.error("Invalid summon log");
    return;
  }

  const { cookieJar, initializer, details, uid } = summonCookieJarLog.args;

  const _details: {} = JSON.parse(details as string) as Details;

  const decoded = decodeFunctionData({
    abi: parseAbi(["function setUp(bytes)"]),
    data: initializer,
  });

  const decodedSetUp = decodeAbiParameters(
    parseAbiParameters(
      "address safeTarget, uint256 periodLenght, uint256 cookieAmount, address cookieToken, address[] allowlist"
    ),
    decoded.args[0]
  );

  const _decodedCookieJar = {
    ..._details,
    jarUid: uid,
    address: cookieJar.toLowerCase() as `0x${string}`,
    initializer: {
      safeTarget: decodedSetUp[0],
      periodLength: decodedSetUp[1],
      cookieAmount: decodedSetUp[2],
      cookieToken: decodedSetUp[3],
      allowList: decodedSetUp[4],
    },
  } as CookieJar;

  try {
    console.log("Storing cookieJar", _decodedCookieJar);
    const id = await db.cookieJars
      .put(_decodedCookieJar, uid)
      .then(async () => {
        await db.subscriptions.add({
          address: _decodedCookieJar.address as `0x${string}`,
          event: parseAbiItem(
            "event GiveCookie(address indexed cookieMonster, uint256 amount, string _uid)"
          ),
          eventHandler: "StoreCookie",
          fromBlock: summonCookieJarLog.blockNumber!,
          lastBlock: summonCookieJarLog.blockNumber!,
        });
      });

    console.log(`Stored cookieJar ${_decodedCookieJar} at ${id}`);
  } catch (e) {
    console.error("Failed to store cookieJar", e);
  }
};

const storeCookie = async (giveCookieLog: Log, publicClient: PublicClient) => {
  if (!hasArgs(giveCookieLog)) {
    console.error("Invalid log");
    return;
  }

  if (!isGiveCookieLog(giveCookieLog.args)) {
    console.error("Invalid giveCookie log");
    return;
  }

  console.log("Parsing cookie event");

  const { cookieMonster, amount, _uid } = giveCookieLog.args;
  const cookieJar = await db.cookieJars
    .where("address")
    .equals(giveCookieLog.address)
    .first();

  if (!cookieJar) {
    console.error("Could not find cookieJar for event", giveCookieLog);
    return;
  }

  const cookie = {
    jarUid: cookieJar.jarUid,
    cookieGiver: giveCookieLog.data,
    cookieMonster,
    cookieUid: _uid,
    amount,
    reasonTag: await calculateReasonTag(cookieJar.jarUid, _uid),
    assessTag: await calculateAssessTag(cookieJar.jarUid, _uid),
  } as Cookie;

  console.log("Found cookie: ", cookie);

  try {
    console.log("Storing cookie", cookie);
    await db.cookies
      .put(cookie, cookie.jarUid + cookie.cookieUid)
      .then((id) => console.log(`Stored cookie ${cookie} at ${id}`));
  } catch (e) {
    console.error("Failed to store cookie", e);
  }
};

export const getEventHandler = (handler: EventHandlers) => {
  switch (handler) {
    case "StoreCookie":
      return storeCookie;
    case "StoreCookieJar":
      return storeCookieJar;
    default:
      console.error(`No event handler found for ${handler}`);
      return undefined;
  }
};

const calculateReasonTag = async (cookieJarUid: string, cookieUid: string) => {
  const reasonTag = keccak256(
    stringToBytes(`CookieJar.${cookieJarUid}.reason.${cookieUid}`)
  );

  console.log(`Calculated reasonTag: ${reasonTag} for cookie ${cookieUid}`);
  return reasonTag;
};

const calculateAssessTag = async (cookieJarUid: string, cookieUid: string) => {
  const assessTag = keccak256(
    stringToBytes(`CookieJar.${cookieJarUid}.reaction.${cookieUid}`)
  );

  console.log(`Calculated assessTag: ${assessTag} for cookie ${cookieUid}`);
  return assessTag;
};

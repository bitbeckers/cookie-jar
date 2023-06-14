import { Initializer } from "../hooks/useCookieJarFactory";
import { ethers } from "ethers";
import { Event } from "chainsauce-web";

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
  amount?: string;
  reason?: string;
  link?: string;
};

export type CookieJar = {
  id: string;
  address: string;
  details: DetailsSchema;
  initializer?: Initializer;
};

export const parseGiveCookieEvent = (event: Event) => {
  // event GiveCookie(address indexed cookieMonster, uint256 amount, string _uid);
  const { cookieMonster, amount, _uid } = event.args;
  console.log("Event: ", event);
  console.log("Found cookieMonster: ", cookieMonster);
  console.log("Found amount: ", amount);
  console.log("Found _uid: ", _uid);

  return {
    cookieMonster,
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
  let decoded: ethers.utils.Result;

  console.log("Found  details: ", _details);
  console.log("Found initializer: ", initializer);
  console.log("Found uid: ", uid);
  console.log("Found cookieJar: ", cookieJar);
  switch (_details.type) {
    case "6551":
      console.log("Found 6551 initializer");
      // decoded = ethers.utils.defaultAbiCoder.decode(
      //   ["address", "uint256", "uint256", "address", "address[]"],
      //   initializer
      // );
      // console.log("Decoded");
      // initParams = {
      //   safeTarget: decoded[0],
      //   periodLength: decoded[1],
      //   cookieAmount: decoded[2],
      //   allowList: decoded[3],
      // } as ListInitializer;
      break;
    case "BAAL":
      console.log("Found BAAL initializer");
      // decoded = ethers.utils.defaultAbiCoder.decode(
      //   [
      //     "address",
      //     "uint256",
      //     "uint256",
      //     "address",
      //     "address",
      //     "uint256",
      //     "bool",
      //     "bool",
      //   ],
      //   initializer
      // );
      // console.log(decoded);
      // initParams = {
      //   safeTarget: decoded[0],
      //   cookieAmount: decoded[1],
      //   periodLength: decoded[2],
      //   cookieToken: decoded[3],
      //   dao: decoded[4],
      //   threshold: decoded[5],
      //   useShares: decoded[6],
      //   useLoot: decoded[7],
      // } as BaalInitializer;
      break;
    case "ERC20":
      console.log("Found ERC20 initializer");
      // decoded = ethers.utils.defaultAbiCoder.decode(
      //   ["address", "uint256", "uint256", "address", "address", "uint256"],
      //   initializer
      // );
      // console.log(decoded);

      // initParams = {
      //   safeTarget: decoded[0],
      //   cookieAmount: decoded[1],
      //   periodLength: decoded[2],
      //   cookieToken: decoded[3],
      //   erc20Addr: decoded[4],
      //   threshold: decoded[5],
      // } as Erc20Initializer;

      break;
    default:
      console.log("Unknown jar type");
    // decoded = ethers.utils.defaultAbiCoder.decode(
    //   ["address", "uint256", "uint256", "address"],
    //   initializer
    // );
    // console.log(decoded);
    // initParams = {
    //   safeTarget: decoded[0],
    //   cookieAmount: decoded[1],
    //   periodLength: decoded[2],
    //   cookieToken: decoded[3],
    // } as CookieJarInitializer;
  }

  return {
    id: uid,
    details: _details,
    address: cookieJar,
  } as CookieJar;
};

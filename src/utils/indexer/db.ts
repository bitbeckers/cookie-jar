import { Abi, AbiEvent } from "abitype";
import Dexie, { Table } from "dexie";
import { EventHandlers } from "./eventHandlers";

export interface CookieJarInitializer {
  safeTarget: string;
  cookieAmount: bigint;
  periodLength: bigint;
  cookieToken: string;
}

export interface ListInitializer extends CookieJarInitializer {
  allowList: string[];
}

export interface ERC20Initializer extends CookieJarInitializer {
  _erc20addr: string;
  _threshold: bigint;
}

export interface ERC721Initializer extends CookieJarInitializer {
  _erc721addr: string;
  _threshold: bigint;
}

export interface BaalInitializer extends CookieJarInitializer {
  _dao: string;
  _threshold: bigint;
  _useShares: boolean;
  _useLoot: boolean;
}

export type Initializer =
  | CookieJarInitializer
  | ListInitializer
  | ERC20Initializer
  | ERC721Initializer
  | BaalInitializer;

export interface CookieJar {
  chainId: 5 | 100;
  jarUid: string;
  address: string;
  type: string;
  title: string;
  description: string;
  link: string;
  initializer: Initializer;
}

export interface Subscription {
  chainId: 5 | 100;
  address: `0x${string}`;
  event: AbiEvent;
  eventHandler: EventHandlers;
  fromBlock: bigint;
  lastBlock: bigint;
}

export interface Cookie {
  cookieUid: string;
  jarUid: string;
  cookieGiver: string;
  cookieMonster: string;
  amount: bigint;
  reasonTag: string;
  assessTag: string;
}

export interface Reason {
  title: string;
  description: string;
  link: string;
  user: string;
  receiver: string;
  reasonTag: string;
}

export interface Rating {
  id?: number;
  assessTag: string;
  user: string;
  isGood: boolean;
}

export class CookieDB extends Dexie {
  // We just tell the typing system this is the case
  subscriptions!: Table<Subscription>;
  cookieJars!: Table<CookieJar>;
  cookies!: Table<Cookie>;
  reasons!: Table<Reason>;
  ratings!: Table<Rating>;
  keyvals!: Table<any>;

  constructor() {
    super("cookieDb");
    this.version(1).stores({
      cookieJars: "&jarUid, address, type, chainId", // Primary key and indexed props
      subscriptions:
        "[chainId+address+event.name], address, lastBlock, event.name, chainId",
      cookies: "[jarUid+cookieUid]",
      reasons: "&reasonTag, user, receiver",
      ratings: "[assessTag+user], assessTag, user, isGood",
      keyvals: "",
    });
  }
}

export const db = new CookieDB();

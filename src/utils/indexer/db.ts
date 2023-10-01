import { Abi, AbiEvent } from "abitype";
import Dexie, { Table } from "dexie";
import { CreateContractEventFilterReturnType } from "viem";
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

export type Initializer = CookieJarInitializer | ListInitializer;

export interface CookieJar {
  jarUid: string;
  address: string;
  type: string;
  name: string;
  description?: string;
  link?: string;
  initializer?: Initializer;
}

export interface Subscription {
  address: `0x${string}`;
  event: AbiEvent;
  eventHandler: EventHandlers;
  fromBlock: bigint;
  lastBlock: bigint;
}

export interface Cookie {
  cookieUid: string;
  jarUid: string;
  cookieGiver: `0x${string}`;
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
      cookieJars: "&jarUid, address, type", // Primary key and indexed props
      subscriptions: "[address+event.name], address, lastBlock, event.name",
      cookies: "[jarUid+cookieUid]",
      reasons: "&reasonTag, user, receiver",
      ratings: "[assessTag+user], assessTag, user, isGood",
      keyvals: "",
    });
  }
}

export const db = new CookieDB();

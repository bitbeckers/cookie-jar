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
  reasonTag: string;
  cookieGiver: `0x${string}`;
  cookieMonster: string;
  amount: bigint;
}

export interface Reason {
  title: string;
  description: string;
  link: string;
  user: string;
  receiver: string;
  tag: string;
}

export class CookieDB extends Dexie {
  // We just tell the typing system this is the case
  subscriptions!: Table<Subscription>;
  cookieJars!: Table<CookieJar>;
  cookies!: Table<Cookie>;
  reasons!: Table<Reason>;
  keyvals!: Table<any>;

  constructor() {
    super("cookieDb");
    this.version(1).stores({
      cookieJars: "&jarUid, address, type", // Primary key and indexed props
      subscriptions: "[address+event.name], address, lastBlock, event.name",
      cookies: "[jarUid+cookieUid]",
      reasons: "&tag, user, receiver",
      keyvals: "",
    });
  }
}

export const db = new CookieDB();

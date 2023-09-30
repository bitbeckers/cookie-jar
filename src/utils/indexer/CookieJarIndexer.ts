import { PublicClient } from "viem";
import { db, CookieDB } from "./db";
import { AbiEvent } from "abitype";
import { EventHandlers, getEventHandler } from "./eventHandlers";
import { debounce } from "lodash";

interface CookieJarIndexerInterface {
  db: CookieDB;
  subscribe: (
    address: `0x${string}`,
    event: AbiEvent,
    fromBlock: bigint,
    eventHandler: EventHandlers
  ) => void;
}

class CookieJarIndexer implements CookieJarIndexerInterface {
  private _publicClient: PublicClient;
  private _db: CookieDB;
  updating = false;
  update: () => void;

  constructor(publicClient: PublicClient) {
    this._db = db;
    this._publicClient = publicClient;

    this.update = debounce(async () => this._update(), 5000, {
      maxWait: 60000,
    });
    this.update();
  }

  public get db() {
    return this._db;
  }

  _update = async () => {
    if (this.updating) {
      console.log("Already updating");
      return;
    }

    console.log("Updating");
    this.updating = true;
    const currentBlock = await this._publicClient.getBlockNumber();
    const subscriptions = await this.db.subscriptions.toArray();

    console.log(subscriptions);

    try {
      await Promise.all(
        subscriptions.map(async (s) => {
          if (s.lastBlock >= currentBlock) {
            return;
          }

          const events = await this._publicClient.getLogs({
            address: s.address,
            event: s.event,
            fromBlock: s.lastBlock,
            toBlock: currentBlock,
          });

          if (events.length === 0) {
            console.log(`No new events for ${s.address} on ${s.event.name}`);
          } else {
            const eventHandler = getEventHandler(s.eventHandler);
            if (!eventHandler) {
              console.error(`No event handler found for ${s.eventHandler}`);
              return;
            }
            console.log(
              `Got event for ${s.address} on ${s.event.name}`,
              events
            );
            await Promise.all(events.map(async (e) => eventHandler(e, this._publicClient)));
          }

          //TODO debounce/throttle this; currently calls update 3x
          await this.db.subscriptions.update(s, {
            lastBlock: currentBlock,
          });
        })
      );
    } catch (e) {
      console.error("Failed to update subscriptions", e);
    } finally {
      this.updating = false;
    }
  };

  subscribe = async (
    address: `0x${string}`,
    event: AbiEvent,
    fromBlock: bigint,
    eventHandler: EventHandlers
  ) => {
    if (!this.db) {
      console.error("Database not initialized");
      return undefined;
    }

    console.log(`Subscribing to ${address} ${event.name} events`);

    try {
      const id = await this.db.subscriptions.add({
        address,
        event,
        eventHandler,
        fromBlock,
        lastBlock: fromBlock,
      });

      console.log(`Subscribed to ${address} ${event} events at id ${id}`);
    } catch (e) {
      console.error("Failed to subscribe to event", e);
    }
  };
}

export default CookieJarIndexer;

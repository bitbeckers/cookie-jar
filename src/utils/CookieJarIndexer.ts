import { createIndexer, IdbStorage } from "chainsauce-web";
import type { EventHandler, Indexer } from "chainsauce-web";
import { Web3Provider } from "@ethersproject/providers";
import { Contract, ContractInterface } from "@ethersproject/contracts";
import { add } from "lodash";

interface CookieJarIndexerInterface {
  storage: IdbStorage;
  provider: Web3Provider;
  eventHandler: EventHandler<IdbStorage>;
  indexer?: Indexer<IdbStorage>;
  init: () => Promise<void>;
  subscribe: (
    address: string,
    abi: ContractInterface,
    chainName: string,
    fromBlock: number
  ) => Contract;
}

class CookieJarIndexer implements CookieJarIndexerInterface {
  storage: IdbStorage;
  provider: Web3Provider;
  eventHandler: EventHandler<IdbStorage>;
  indexer?: Indexer<IdbStorage>;

  constructor(
    storageEntities: string[],
    provider: Web3Provider,
    eventHandler: EventHandler<IdbStorage>
  ) {
    this.storage = new IdbStorage(storageEntities);
    this.provider = provider;
    this.eventHandler = eventHandler;
  }

  init = async () => {
    this.indexer = await createIndexer(
      this.provider,
      this.storage,
      this.eventHandler
    );
  };

  subscribe = (
    address: string,
    abi: ContractInterface,
    chainName: string,
    fromBlock: number
  ) => {
    if (!this.indexer) {
      throw new Error("Indexer not initialized");
    }

    return this.indexer.subscribe(address, abi, chainName, fromBlock);
  };
}

export default CookieJarIndexer;

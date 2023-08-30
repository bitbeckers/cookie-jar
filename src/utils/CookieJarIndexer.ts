import { createIndexer, IdbStorage } from "chainsauce-web";
import type { EventHandler, Indexer } from "chainsauce-web";
import { Abi, PublicClient } from "viem";
import { Contract, utils, providers } from "ethers";
import { JsonFragment } from "@daohaus/utils";

interface CookieJarIndexerInterface {
  storage: IdbStorage;
  rpc: string;
  eventHandler: EventHandler<IdbStorage>;
  indexer?: Indexer<IdbStorage>;
  init: () => Promise<void>;
  subscribe: (
    address: string,
    abi: Abi,
    chainName: string,
    fromBlock: number
  ) => Contract;
}

class CookieJarIndexer implements CookieJarIndexerInterface {
  storage: IdbStorage;
  rpc: string;
  eventHandler: EventHandler<IdbStorage>;
  indexer?: Indexer<IdbStorage>;

  constructor(
    storageEntities: string[],
    rpc: string,
    eventHandler: EventHandler<IdbStorage>
  ) {
    this.storage = new IdbStorage(storageEntities);
    this.rpc = rpc;
    this.eventHandler = eventHandler;
  }

  init = async () => {
    const provider = new providers.JsonRpcProvider(this.rpc, 100);
    this.indexer = await createIndexer(
      provider,
      this.storage,
      this.eventHandler
    );
  };

  subscribe = (
    address: string,
    abi: Abi,
    chainName: string,
    fromBlock: number
  ) => {
    if (!this.indexer) {
      throw new Error("Indexer not initialized");
    }

    const ethersAbi = new utils.Interface(abi as JsonFragment[]);

    return this.indexer.subscribe(address, ethersAbi, chainName, fromBlock);
  };
}

export default CookieJarIndexer;

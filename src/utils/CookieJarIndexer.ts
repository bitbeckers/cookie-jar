import { createIndexer, IdbStorage } from "chainsauce-web";
import type { EventHandler, Indexer } from "chainsauce-web";
import { Abi, PublicClient } from "viem";
import { Contract, providers, utils } from "ethers";
import { useEthersProvider } from "./ethersAdapters";
import { JsonFragment } from "@daohaus/utils";

interface CookieJarIndexerInterface {
  storage: IdbStorage;
  publicClient: PublicClient;
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
  publicClient: PublicClient;
  eventHandler: EventHandler<IdbStorage>;
  indexer?: Indexer<IdbStorage>;

  constructor(
    storageEntities: string[],
    publicClient: PublicClient,
    eventHandler: EventHandler<IdbStorage>
  ) {
    this.storage = new IdbStorage(storageEntities);
    this.publicClient = publicClient;
    this.eventHandler = eventHandler;
  }

  init = async () => {
    const provider = useEthersProvider({ chainId: 100 });
    this.indexer = await createIndexer(
      provider as providers.JsonRpcProvider,
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

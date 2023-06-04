import { BigNumberish, ContractTransaction } from "ethers";

import CookieJarFactory from "../abis/CookieJarFactory.json";
import { useDHConnect } from "@daohaus/connect";
import { ethers } from "ethers";
import { useTargets } from "./useTargets";

export interface CookieJarInitializer {
  safeTarget: string;
  cookieAmount: BigNumberish;
  periodLength: BigNumberish;
  cookieToken: string;
}

export interface BaalInitializer extends CookieJarInitializer {
  dao: string;
  threshold: BigNumberish;
  useShares: boolean;
  useLoot: boolean;
}

export interface Erc20Initializer extends CookieJarInitializer {
  erc20Addr: string;
  threshold: BigNumberish;
}

export type Initializer =
  | CookieJarInitializer
  | BaalInitializer
  | Erc20Initializer;

interface CookieJarFactory {
  factoryContract: ethers.Contract;
  summonCookieJar: (
    details: Details,
    initializer: Initializer
  ) => Promise<ContractTransaction> | undefined;
}

export type Details = {
  type: string;
  name: string;
  description?: string;
};

export const useCookieJarFactory = () => {
  const { provider } = useDHConnect();
  const addresses = useTargets();

  if (!addresses) return {};

  const factoryContract = new ethers.Contract(
    addresses.COOKIEJAR_FACTORY_ADDRESS,
    CookieJarFactory.abi,
    provider?.getSigner()
  );

  return {
    factoryContract,
    summonCookieJar: (details: Details, initializer: Initializer) =>
      _summonCookieJar(factoryContract, details, initializer),
  };
};

const _summonCookieJar = async (
  contract: ethers.Contract,
  details: Details,
  initializer: Initializer
) => {
  let _details;
  let _initializer;
  const addresses = useTargets();

  console.log("contract", contract);
  if (instanceOfBaalInitializer(initializer)) {
    console.log("Summoning Baal Cookie Jar");
    _details = {
      ...details,
      type: "BAAL",
    };

    console.log("_details: ", _details);
    console.log("_initializer: ", initializer);
    console.log("address: ", addresses?.BAAL_COOKIEJAR_ADDRESS);

    const detailString = JSON.stringify(_details);

    console.log("detailsString: ", JSON.stringify(_details));

    return await contract.summonCookieJar(
      detailString,
      addresses?.BAAL_COOKIEJAR_ADDRESS,
      initializer
    );
  }

  if (instanceOfErc20Initializer(initializer)) {
    console.log("Summoning ERC20 Cookie Jar");

    _details = {
      ...details,
      type: "ERC20",
    };

    console.log("_details: ", _details);
    console.log("_initializer: ", _initializer);
    console.log("address: ", addresses?.ERC20_COOKIEJAR_ADDRESS);

    const detailString = JSON.stringify(_details);

    console.log("detailsString: ", JSON.stringify(_details));

    return contract.summonCookieJar(
      detailString,
      addresses?.ERC20_COOKIEJAR_ADDRESS,
      initializer
    );
  }
};

function instanceOfBaalInitializer(
  initializer: Initializer
): initializer is BaalInitializer {
  return (
    "dao" in initializer &&
    "threshold" in initializer &&
    "useShares" in initializer &&
    "useLoot" in initializer
  );
}

function instanceOfErc20Initializer(
  initializer: Initializer
): initializer is Erc20Initializer {
  return "erc20Addr" in initializer && "threshold" in initializer;
}

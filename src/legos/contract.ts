import { LOCAL_ABI } from "@daohaus/abis";
import { ContractLego } from "@daohaus/utils";
import { CONTRACT_KEYCHAINS } from "@daohaus/keychain-utils";
import COOKIEJAR_ABI from "../abis/cookieJar.json";
import COOKIENFT_ABI from "../abis/cookieNft.json";
import COOKIEJARTARGET_ABI from "../abis/cookieJarTarget.json";
import { TARGET_DAO } from "../targetDao";

export const APP_CONTRACT: Record<string, ContractLego> = {
  COOKIEJAR: {
    type: "static",
    contractName: "COOKIEJAR",
    abi: COOKIEJAR_ABI,
    targetAddress: ".formValues.targetAddress",
  },
  // COOKIEJARTARGET: {
  //   type: "static",
  //   contractName: "COOKIEJARTARGET",
  //   abi: COOKIEJARTARGET_ABI,
  //   targetAddress: ".formValues.target",
  // },
  COOKIENFT: {
    type: "static",
    contractName: "COOKIENFT",
    abi: COOKIENFT_ABI,
    targetAddress: {
      [TARGET_DAO.CHAIN_ID]: TARGET_DAO.NFT_ADDRESS,
    },
  },
  POSTER: {
    type: "static",
    contractName: "Poster",
    abi: LOCAL_ABI.POSTER,
    targetAddress: {
      "0x1": "0x000000000000cd17345801aa8147b8d3950260ff",
      "0x5": "0x000000000000cd17345801aa8147b8d3950260ff",
      "0x64": "0x000000000000cd17345801aa8147b8d3950260ff",
    },
  },
};

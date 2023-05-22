import { POSTER_TAGS } from "@daohaus/utils";
import { buildMultiCallTX } from "@daohaus/tx-builder";
import { APP_CONTRACT } from "./contract";
import { TARGET_DAO } from "../targetDao";

export enum ProposalTypeIds {
  Signal = "SIGNAL",
  IssueSharesLoot = "ISSUE",
  AddShaman = "ADD_SHAMAN",
  TransferErc20 = "TRANSFER_ERC20",
  TransferNetworkToken = "TRANSFER_NETWORK_TOKEN",
  UpdateGovSettings = "UPDATE_GOV_SETTINGS",
  UpdateTokenSettings = "TOKEN_SETTINGS",
  TokensForShares = "TOKENS_FOR_SHARES",
  GuildKick = "GUILDKICK",
  WalletConnect = "WALLETCONNECT",
}
// {
//   type: "JSONDetails",
//   jsonSchema: {
//     title: "to eat a cookie",
//     description: `.reason`,
//     contentURI: `.link`,
//     contentURIType: { type: "static", value: "url" },
//     table: { type: "static", value: "reason" },
//     queryType: { type: "static", value: "list" },
//   },
// },
// `{"daoId":"${
//   TARGET_DAO[import.meta.env.VITE_TARGET_KEY].ADDRESS
// }","table":"reason","queryType":"list","title":"to eat a cookie","description":"${reason}","link":"${link}"}`,

//
export const APP_TX = {
  COOKIEJAR: {
    id: "COOKIEJAR",
    contract: APP_CONTRACT.COOKIEJAR,
    method: "reachInJar",
    args: [
      ".formValues.receiver",
      {
        type: "JSONDetails",
        jsonSchema: {
          title: { type: "static", value: "to eat a cookie" },
          user: ".formValues.user",
          receiver: ".formValues.receiver",
          description: ".formValues.description",
          link: ".formValues.link",
          table: { type: "static", value: "reason" },
          queryType: { type: "static", value: "list" },
        },
      },
    ],
  },
  CREATENFTJAR: {
    id: "CREATENFTJAR",
    contract: APP_CONTRACT.COOKIENFT,
    method: "cookieMint",
    args: [
      ".formValues.receiver",
      ".formValues.cookiePeriod",
      ".formValues.cookieAmount",
      ".formValues.cookieToken",
      ".formValues.allowList",
    ],
  },
  COOKIEJARTARGET: {
    id: "COOKIEJARTARGET",
    contract: APP_CONTRACT.COOKIEJARTARGET,
    method: "executeCall",
    args: [
      ".to",
      ".value",
      ".data"
    ],
    staticArgs: []
    // method: "setConfig",
    // args: [
    //   ".formValues.cookiePeriod",
    //   ".formValues.cookieAmount",
    //   ".formValues.cookieToken",
    // ],
  }
};

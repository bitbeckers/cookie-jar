import { APP_CONTRACT } from "./contract";

export const APP_TX = {
  COOKIEJAR: {
    id: "COOKIEJAR",
    contract: APP_CONTRACT.COOKIEJAR,
    method: "reachInJar(address,string)",
    args: [
      ".formValues.receiver",
      {
        type: "JSONDetails",
        jsonSchema: {
          title: { type: "static", value: "CookieJar" },
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
    disablePoll: true,
    args: [
      ".formValues.receiver",
      ".formValues.cookiePeriod",
      ".formValues.cookieAmount",
      ".formValues.cookieToken",
      ".formValues.donationToken",
      ".formValues.donationAmount",
      ".formValues.allowList",
    ],
    overrides: {
      value: ".formValues.donationAmount",
    },
  },
  COOKIEJARTARGET: {
    id: "COOKIEJARTARGET",
    contract: APP_CONTRACT.COOKIEJARTARGET,
    method: "executeCall",
    disablePoll: true,
    args: [".to", ".value", ".data"],
    staticArgs: [],
  },
};

import { CustomFormLego } from "./fieldConfig";
import { APP_FIELD } from "./fields";
import { APP_TX } from "./tx";
import { TXLego } from "@daohaus/utils";

export const APP_FORM: Record<string, CustomFormLego> = {
  CREATEJAR: {
    id: "CREATEJAR",
    title: "Mint Jar",
    subtitle: "Own the utility",
    description: "A cookie jar is a jar that holds cookies.",
    requiredFields: {
      receiver: true,
      cookiePeriod: true,
      cookieToken: true,
      cookieAmount: true,
    },
    log: true,
    tx: APP_TX.CREATE_NFT_JAR as TXLego,
    fields: [
      APP_FIELD.RECEIVER,
      APP_FIELD.COOKIE_PERIOD,
      APP_FIELD.COOKIE_AMOUNT,
      APP_FIELD.COOKIE_TOKEN,
      { ...APP_FIELD.CSTEXTAREA, id: "allowList", label: "Allow List" },
      { ...APP_FIELD.DONATION, id: "donation", label: "Donate to the devs" },
    ],
  },
  CONFIGJAR: {
    id: "CONFIGJAR",
    title: "Config Jar",
    subtitle: "You must own the jar",
    description: "A cookie jar is a jar that holds cookies.",
    requiredFields: {
      cookiePeriod: true,
      cookieToken: true,
      cookieAmount: true,
    },
    log: true,
    fields: [
      APP_FIELD.COOKIE_PERIOD,
      APP_FIELD.COOKIE_TOKEN,
      APP_FIELD.COOKIE_AMOUNT,
    ],
  },
  MANAGEJAR: {
    id: "MANAGEJAR",
    title: "Manage AllowList",
    subtitle: "You must own the jar",
    description: "A cookie jar is a jar that holds cookies.",
    log: true,
    fields: [APP_FIELD.CSTEXTAREA],
  },
  JARCLAIM: {
    id: "JARCLAIM",
    title: "Go ahead, reach in and grab a cookie!",
    subtitle: "if you dare",
    description:
      "You have not claimed your daily cookie yet. Claiming a cookie will send funds direct to you from the jar.",
    requiredFields: {
      description: true,
    },
    tx: APP_TX.COOKIEJAR as TXLego,
    log: true,
    fields: [
      { ...APP_FIELD.DESCRIPTION, label: "Reason" },
      APP_FIELD.LINK,
      {
        ...APP_FIELD.RECEIVER,
        // @ts-ignore
        gateLabel: "Claim for another user",
      },
    ],
  },
};

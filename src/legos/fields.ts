import { ZERO_ADDRESS } from "@daohaus/utils";
import { CustomFieldLego } from "./fieldConfig";

export const APP_FIELD: Record<string, CustomFieldLego> = {
  CSTEXTAREA: {
    id: "cstextarea",
    type: "cstextarea",
    label: "array input",
    placeholder: "array items seperated by new lines",
    itemNoun: {
      singular: "item",
      plural: "items",
    },
  },
  TITLE: {
    id: "title",
    type: "input",
    label: "Name",
    placeholder: "Enter name",
  },
  DESCRIPTION: {
    id: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter description",
  },
  SAFETARGET: {
    id: "safeTarget",
    type: "input",
    label: "Safe address",
    placeholder: "Enter safe address",
  },
  COOKIE_AMOUNT: {
    id: "cookieAmount",
    type: "toWeiInput",
    label: "Cookie Amount",
    placeholder: "Enter amount of cookies",
  },
  COOKIE_PERIOD: {
    id: "cookiePeriod",
    type: "periodLength",
    label: "Period Length",
  },
  COOKIE_TOKEN: {
    id: "checkRenderToken",
    type: "checkRender",
    gateLabel: "Use Custom Token (native token by default)",
    components: [
      {
        id: "cookieToken",
        type: "input",
        label: "Cookie Token",
        defaultValue: ZERO_ADDRESS,
        expectType: "ethAddress",
        placeholder: "Enter something",
      },
    ],
  },
  LINK: {
    id: "link",
    type: "input",
    label: "link",
    defaultValue: "",
    expectType: "url",
    placeholder: "http://example.com",
  },
  RECEIVER: {
    id: "checkRenderReceiver",
    type: "checkRender",
    gateLabel: "Change owner role (minter by default)",
    components: [
      {
        id: "receiver",
        type: "input",
        label: "receiver",
        expectType: "ethAddress",
        placeholder: "0x...",
      },
    ],
  },
  USELOOT: {
    id: "useLoot",
    type: "switch",
    label: "Use loot",
    switches: [
      {
        id: "useLoot",
        fieldLabel: "Use loot",
      },
    ],
  },
  TOKENADDRESS: {
    id: "tokenAddress",
    type: "input",
    label: "Token address",
    placeholder: "Enter token address",
  },
};

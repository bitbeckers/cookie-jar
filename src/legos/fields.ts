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
    label: "Proposal Title",
    placeholder: "Enter title",
  },
  DESCRIPTION: {
    id: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Enter description",
  },
  LINK: {
    id: "link",
    type: "input",
    label: "Link",
    placeholder: "http://",
    expectType: "url",
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
};

import styled from "styled-components";

import { AddressDisplay, Card, Label, ParMd } from "@daohaus/ui";
import cookie from "../assets/cookie.png";
import { ZERO_ADDRESS, formatPeriods, fromWei } from "@daohaus/utils";
import { StyledRouterLink } from "./Layout";
import { BigNumber } from "ethers";
import COOKIEJAR_CORE_ABI from "../abis/CookieJarCore.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTargets } from "../hooks/useTargets";
import { CookieJar } from "../utils/cookieJarHandlers";
/**

 */
export const JarCard = ({ record }: { record: CookieJar }) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const { provider } = useDHConnect();

  const target = useTargets();

  useEffect(() => {
    const getIsAllowed = async () => {
      if (provider) {
        const cookieJarContract = new ethers.Contract(
          record.address,
          COOKIEJAR_CORE_ABI.abi,
          provider
        );

        const isAllowed = await cookieJarContract.canClaim();
        setIsAllowed(isAllowed);
      }
    };

    getIsAllowed();
  }, []);

  return (
    <div style={{ marginBottom: "3rem" }}>
      <Card>
        <img src={cookie} alt="cookie" height={"20px"} />

        <AddressDisplay
          address={record.address}
          copy
          explorerNetworkId={target?.CHAIN_ID}
        />

        <Label>Safe: </Label>
        <AddressDisplay
          address={record?.initializer?.safeTarget || ZERO_ADDRESS}
          copy
          explorerNetworkId={target?.CHAIN_ID}
        />

        <Label>Type: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>{record.details.type}</ParMd>
        <Label>Title: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>{record.details.type}</ParMd>
        <Label>Description: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>...</ParMd>

        <Label>Period: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>
          {`${formatPeriods(
            BigNumber.from(record?.initializer?.periodLength || "0").toString()
          )}`}
        </ParMd>
        <Label>Amount: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>
          {BigNumber.from(record?.initializer?.cookieAmount || "0").toString()}
        </ParMd>
        <Label>Token: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>
          {record.initializer?.cookieToken == ZERO_ADDRESS
            ? "Native Token"
            : record?.initializer?.cookieToken}
        </ParMd>
        <Label>on allowlist: </Label>
        <ParMd style={{ marginBottom: ".4rem" }}>
          {isAllowed ? "Yes" : "No"}
        </ParMd>
        <ParMd style={{ marginBottom: ".4rem" }}>
          Go to{" "}
          <StyledRouterLink
            to={`/claims/${target?.CHAIN_ID}/${record.address}`}
          >
            Claim
          </StyledRouterLink>{" "}
          to claim your tokens.
        </ParMd>
      </Card>
    </div>
  );
};

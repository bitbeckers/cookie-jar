import styled from "styled-components";

import {
  AddressDisplay,
  Card,
  DataIndicator,
  H4,
  Label,
  ParMd,
  Tag,
  widthQuery,
} from "@daohaus/ui";
import cookie from "../assets/cookie.png";
import {
  ZERO_ADDRESS,
  formatPeriods,
  fromWei,
  toWholeUnits,
} from "@daohaus/utils";
import { StyledRouterLink } from "./Layout";
import { BigNumber } from "ethers";
import COOKIEJAR_CORE_ABI from "../abis/CookieJarCore.json";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDHConnect } from "@daohaus/connect";
import { useTargets } from "../hooks/useTargets";
import { CookieJar } from "../utils/cookieJarHandlers";
import { useCookieJar } from "../hooks/useCookieJar";

export const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.secondary.step3};
  border: 1px solid white;
  padding: 3rem;
  width: 100%;
`;

export const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 3rem;

  .right-section {
    display: flex;
  }

  .safe-link {
    padding: 0.9rem;
    background-color: ${({ theme }) => theme.secondary.step5};
    border-radius: 4px;
  }
`;

export const TagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.8rem;
`;

export const DataGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-content: space-between;
  div {
    padding: 2rem 0;
    width: 25rem;

    @media ${widthQuery.sm} {
      min-width: 100%;
    }
  }
`;

export const JarCard = ({ record }: { record: CookieJar }) => {
  const target = useTargets();
  const { cookieJar, isMember } = useCookieJar({ cookieJarId: record.id });

  return (
    <div style={{ marginBottom: "3rem" }}>
      <StyledCard>
        <StyledCardHeader>
          <div>
            <img src={cookie} alt="cookie" height={"20px"} />
            <H4>{record.name}</H4>
            <ParMd style={{ marginBottom: ".4rem" }}>
              {record.description}
            </ParMd>

            {/* <Label>Cookie Jar</Label>
              <AddressDisplay
                address={record.address}
                truncate
                copy
                explorerNetworkId={target?.CHAIN_ID}
              /> */}
            <TagSection>
              <Label>Treasury:</Label>
              <AddressDisplay
                address={record?.initializer?.safeTarget || ZERO_ADDRESS}
                copy
                truncate
                explorerNetworkId={target?.CHAIN_ID}
              />

              <Tag tagColor="pink">{record.type}</Tag>
              
            </TagSection>
            <TagSection>
              <Label>Member</Label>
              <Tag tagColor="pink">
                {isMember ? (
                  <span style={{ color: "green" }}>Yes</span>
                ) : (
                  <span style={{ color: "red" }}>No</span>
                )}
              </Tag>
            </TagSection>
          </div>
          <div className="right-section">...</div>
        </StyledCardHeader>

        <DataGrid>
          <>
            <DataIndicator
              label="Period"
              data={formatPeriods(
                BigNumber.from(
                  record?.initializer?.periodLength || "0"
                ).toString()
              )}
            />
            <DataIndicator
              label="Amount"
              data={toWholeUnits(
                BigNumber.from(
                  record?.initializer?.cookieAmount || "0"
                ).toString(),
                18
              )}
            />
            <DataIndicator
              label="Token"
              data={
                record.initializer?.cookieToken == ZERO_ADDRESS
                  ? "Native Token"
                  : record?.initializer?.cookieToken
              }
            />
            <DataIndicator
              label="Jar Balance"
              data={"TODO"}
            />
          </>
        </DataGrid>

        <ParMd style={{ marginBottom: ".4rem" }}>
          <StyledRouterLink to={`/claims/${record.id}`}>Claim</StyledRouterLink> tokens.
        </ParMd>
        <ParMd style={{ marginBottom: ".4rem" }}>
          Go to{" "}
          <StyledRouterLink to={`/history/${record.id}`}>
            History
          </StyledRouterLink>{" "}
          to inspect the crumbles.
        </ParMd>
      </StyledCard>
    </div>
  );
};

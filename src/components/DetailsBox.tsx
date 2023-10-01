import styled from "styled-components";

import { DataIndicator } from "@daohaus/ui";
import { formatPeriods, formatValueTo, fromWei } from "@daohaus/utils";
import { StyledRouterLink } from "./Layout";

const DetailsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 40%;
  justify-content: space-between;
`;

export const ClaimDetails = ({
  claimAmt,
  claimPeriod,
  unit,
  claimId
}: {
  claimAmt: bigint;
  claimPeriod: bigint;
  unit: string;
  claimId: string | undefined;
}) => {
  console.log("claimAmt", claimAmt);
  return (
    <DetailsBox>
      <DataIndicator
        label="Claim Amount"
        data={formatValueTo({
          value: fromWei(claimAmt.toString()),
          decimals: 2,
          format: "numberShort",
          unit: unit,
        })}
      />
      <DataIndicator label="Claim Period" data={formatPeriods(claimPeriod)} />
      <DataIndicator label="Balance" data={"TODO"} />
      <StyledRouterLink to={`/history/${claimId || ""}`}>
        View History
      </StyledRouterLink>{" "}
    </DetailsBox>
  );
};

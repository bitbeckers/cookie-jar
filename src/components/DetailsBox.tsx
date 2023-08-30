import styled from "styled-components";

import { DataIndicator } from "@daohaus/ui";
import { formatPeriods, formatValueTo, fromWei } from "@daohaus/utils";

const DetailsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 30%;
  justify-content: space-between;
`;

export const ClaimDetails = ({
  claimAmt,
  claimPeriod,
  unit,
}: {
  claimAmt: bigint;
  claimPeriod: bigint;
  unit: string;
}) => {
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
      <DataIndicator
        label="Claim Period"
        data={formatPeriods(claimPeriod.toString())}
      />
    </DetailsBox>
  );
};

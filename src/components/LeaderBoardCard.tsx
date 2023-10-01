import { AddressDisplay, Avatar, Card, ParMd } from "@daohaus/ui";
import cookie from "../assets/cookie.png";
import { useProfile } from "@daohaus/moloch-v3-hooks";
import { formatEther } from "viem";
import { useTargets } from "../hooks/useTargets";

/**
 * Represents a leaderboard record.
 *
 * @typedef {Object} LBRecord
 * @property {string} user - The user's address.
 * @property {bigint} count - The user's cookie count.
 */
export interface LBRecord {
  user: string;
  count: bigint;
}

/**
 * Displays a leaderboard card for a given record.
 *
 * @param {Object} props - The props for the component.
 * @param {Object} props.record - The record to display on the leaderboard.
 * @param {string} props.record.user - The user's address.
 * @param {bigint} props.record.count - The user's cookie count.
 * @returns {JSX.Element} A leaderboard card.
 */
export const LeaderBoardCard = ({ record }: { record: LBRecord }) => {
  const { profile } = useProfile({
    address: record.user,
  });
  const target = useTargets();

  return (
    <div style={{ marginBottom: "3rem", width: "50%" }}>
      <Card>
        {/* If the user has a profile image, display it along with their ENS name */}
        {profile && (
          <ParMd style={{ marginBottom: ".4rem" }}>
            {profile?.image && !profile.image.includes("null") && (
              <Avatar alt={profile.ens} size="sm" src={profile.image} />
            )}{" "}
            {profile.ens}
          </ParMd>
        )}
        {/* Display the user's address */}
        <AddressDisplay
          address={record?.user}
          truncate
          copy
          explorerNetworkId={target?.CHAIN_ID}
        />
        {/* Display the user's cookie count */}
        <ParMd style={{ marginBottom: "1rem" }}>
          <img src={cookie} alt="cookie" height={"20px"} />{" "}
          {`Count: ${formatEther(record?.count)}`}
        </ParMd>
      </Card>
    </div>
  );
};

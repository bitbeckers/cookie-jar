import styled from "styled-components";

import { Avatar, Badge, Card, ParMd } from "@daohaus/ui";
import cookie from "../assets/cookie.png";
import { useProfile } from "@daohaus/moloch-v3-hooks";
import { Cookie, Reason, db } from "../utils/indexer/db";
import { useEffect, useState } from "react";

const DootBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

/**
 * Renders a card displaying a history record, including the user's profile picture,
 * username, description, link, and the number of upvotes and downvotes.
 * @param {Object} props - The component props.
 * @param {Object} props.record - The history record to display.
 * @param {string} props.record.user - The username of the user who made the history record.
 * @param {string} props.record.title - The title of the history record.
 * @param {string} props.record.description - The description of the history record.
 * @param {string} props.record.link - The link to the history record.
 */
export const HistoryCard = ({ record }: { record: Cookie }) => {
  const [reason, setReason] = useState<Reason>();
  const { profile: cookieGiver } = useProfile({
    address: record.cookieGiver,
  });

  const { profile: cookieMonster } = useProfile({
    address: record.cookieMonster,
  });

  useEffect(() => {
    const fetchReason = async () => {
      console.log("Fetching reason: ", record.reasonTag);
      const res = await db.reasons.get({ tag: record.reasonTag });
      if (!res) {
        return;
      }
      console.log("Reason: ", res);
      setReason(res);
    };

    fetchReason();
  }, [record.reasonTag]);

  return (
    <div style={{ marginBottom: "3rem", width: "70%" }}>
      <Card>
        {cookieGiver && (
          <ParMd style={{ marginBottom: ".4rem" }}>
            Giver:
            {cookieGiver?.image && !cookieGiver.image.includes("null") && (
              <Avatar alt={cookieGiver.ens} size="sm" src={cookieGiver.image} />
            )}{" "}
            {cookieGiver.ens}
          </ParMd>
        )}
        {cookieMonster && (
          <ParMd style={{ marginBottom: ".4rem" }}>
            CookieMonster:
            {cookieMonster?.image && !cookieMonster.image.includes("null") && (
              <Avatar
                alt={cookieMonster.ens}
                size="sm"
                src={cookieMonster.image}
              />
            )}{" "}
            {cookieMonster.ens}
          </ParMd>
        )}
        <ParMd style={{ marginBottom: "1rem" }}>
          <img src={cookie} alt="cookie" height={"20px"} />{" "}
          {reason ? reason.description : "No reason provided."}
        </ParMd>

        <DootBox style={{ fontSize: "2rem", marginTop: "1rem" }}>
          <div>
            👍
            <Badge badgeLabel={`${0} updoot`} />
          </div>
          <div>
            👎
            <Badge badgeLabel={`${0} downdoot`} />
          </div>
        </DootBox>
      </Card>
    </div>
  );
};

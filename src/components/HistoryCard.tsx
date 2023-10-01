import styled from "styled-components";

import { Avatar, Badge, Button, Card, ParMd } from "@daohaus/ui";
import cookie from "../assets/cookie.png";
import { useProfile } from "@daohaus/moloch-v3-hooks";
import { Cookie, Reason, db } from "../utils/indexer/db";
import { useTxBuilder } from "@daohaus/tx-builder";
import { useDHConnect } from "@daohaus/connect";
import { CookieJarCore } from "../abis";
import { useLiveQuery } from "dexie-react-hooks";

const DootBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const CookieCard = styled(Card)`
  background-color: ${({ theme }) => theme.secondary.step3};
  padding: 3rem;
  width: 100%;
  margin-bottom: 3rem;
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
  const { chainId } = useDHConnect();
  const { fireTransaction } = useTxBuilder();
  const { profile: cookieGiver } = useProfile({
    address: record.cookieGiver,
  });

  const { profile: cookieMonster } = useProfile({
    address: record.cookieMonster,
  });

  const cookieJar = useLiveQuery(
    () => db.cookieJars.where("jarUid").equals(record.jarUid).first(),
    [record]
  );

  const doots = useLiveQuery(
    () => db.ratings.where({ assessTag: record.assessTag }).toArray(),
    [record]
  );

  const reason = useLiveQuery(
    () => db.reasons.get({ reasonTag: record.reasonTag }),
    [record]
  );

  const onDoot = async (doot: "up" | "down") => {
    if (!cookieJar?.address) {
      console.log(`No cookie jar address found for jarId ${record.jarUid}`);
      return;
    }

    const isGood: boolean = doot === "up" ? true : false;

    const tx = await fireTransaction({
      tx: {
        id: "DOOT",
        contract: {
          type: "static",
          contractName: "CookieJar",
          abi: CookieJarCore,
          targetAddress: cookieJar.address as `0x${string}`,
        },
        disablePoll: true,
        method: "assessReason",
        staticArgs: [record.cookieUid, isGood],
      },
      callerState: {
        chainId,
        contractAddress: record.cookieGiver,
      },
    });
    console.log({ tx });
  };

  return (
    <CookieCard style={{ marginBottom: "3rem" }}>
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
        <Button
          onClick={() => onDoot("up")}
          style={{ background: "none", border: "none" }}
        >
          👍
          <Badge
            badgeLabel={`${doots?.filter((d) => d.isGood).length} updoot`}
          />
        </Button>
        <Button
          onClick={() => onDoot("down")}
          style={{ background: "none", border: "none" }}
        >
          👎
          <Badge
            badgeLabel={`${doots?.filter((d) => !d.isGood).length}  downdoot`}
          />
        </Button>
      </DootBox>
    </CookieCard>
  );
};

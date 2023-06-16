import { BiColumnLayout, ParMd, SingleColumnLayout } from "@daohaus/ui";

import { useDHConnect } from "@daohaus/connect";
import { HistoryCard } from "../components/HistoryCard";
import { LeaderBoardCard } from "../components/LeaderBoardCard";
import { useParams } from "react-router-dom";
import { useTargets } from "../hooks/useTargets";
import { useIndexer } from "../hooks/useIndexer";
import { Cookie } from "../utils/eventHandler";
import { useEffect, useMemo, useState } from "react";
import { groupBy, sumBy } from "lodash";

export const History = () => {
  const { address } = useDHConnect();
  const { cookieJarId } = useParams();
  const target = useTargets();
  const [cookies, setCookies] = useState<Partial<Cookie>[]>([]);
  const { getCookiesByJarId } = useIndexer();

  useEffect(() => {
    const fetchCookies = async () => {
      if (!cookieJarId) return;
      const cookies = await getCookiesByJarId(cookieJarId);

      if (!cookies) return;

      setCookies(cookies);
    };

    fetchCookies();
  }, [cookieJarId]);

  const leaderBoardCards = useMemo(() => {
    if (!cookies) return [];

    const groupedCookies = groupBy(cookies, "cookieMonster");

    const leaderboard = Object.entries(groupedCookies)
      .map(([monster, monsterCookies]) => ({
        user: monster,
        count: sumBy(monsterCookies, "amount"),
      }))
      .sort((a, b) => b.count - a.count);

    return leaderboard.map((record, idx) => (
      <LeaderBoardCard record={record} key={idx} />
    ));
  }, [cookies]);

  console.log({ cookies });

  return (
    <>
      {!cookies && <ParMd style={{ marginBottom: "1rem" }}>Loading...</ParMd>}

      <BiColumnLayout
        left={
          <SingleColumnLayout>
            <ParMd style={{ marginBottom: "1rem" }}>
              History (newer first)
            </ParMd>

            {cookies &&
              cookies.map((record, idx) => (
                <HistoryCard record={record} key={idx} />
              ))}
          </SingleColumnLayout>
        }
        right={
          <SingleColumnLayout>
            <ParMd style={{ marginBottom: "1rem" }}>Leader Board</ParMd>
            {leaderBoardCards}
          </SingleColumnLayout>
        }
        subtitle={
          cookies && cookies.length === 0
            ? "No cookie history yet."
            : "Your dashboard for information about your cookie jar"
        }
        title="History and Stats"
      />
    </>
  );
};

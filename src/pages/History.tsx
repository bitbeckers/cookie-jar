import { BiColumnLayout, ParMd, SingleColumnLayout } from "@daohaus/ui";

import { useDHConnect } from "@daohaus/connect";
import { HistoryCard } from "../components/HistoryCard";
import { LeaderBoardCard } from "../components/LeaderBoardCard";
import { useParams } from "react-router-dom";
import { useIndexer } from "../hooks/useIndexer";
import { useMemo } from "react";
import { groupBy, sumBy } from "lodash";
import { useQuery } from "react-query";

export const History = () => {
  const { address } = useDHConnect();
  const { cookieJarId } = useParams();
  const { getCookiesByJarId } = useIndexer();

  const { data: cookies, isLoading } = useQuery({
    queryKey: ["cookies", cookieJarId],
    queryFn: () => getCookiesByJarId(cookieJarId || ""),
    enabled: !!cookieJarId,
    refetchInterval: 3000,
  });

  const leaderBoardCards = useMemo(() => {
    if (!cookies) return [];

    const groupedCookies = groupBy(cookies, "cookieMonster");

    const leaderboard = Object.entries(groupedCookies)
      .map(([monster, monsterCookies]) => ({
        user: monster,
        count: sumBy(monsterCookies, "amount"),
      }))
      .sort((a, b) => b.count - a.count);

    console.log({ leaderboard });

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

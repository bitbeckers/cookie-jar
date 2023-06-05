import { useDHConnect } from "@daohaus/connect";
import { SingleColumnLayout, Spinner } from "@daohaus/ui";

import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import { HAUS_NETWORK_DATA } from "@daohaus/keychain-utils";

import { useCookieJar } from "../hooks/useCookieJar";
import { DisplayClaim } from "../components/DisplayClaim";
import { Countdown } from "../components/Countdown";
import { ClaimDetails } from "../components/DetailsBox";
import { ClaimForm } from "../components/ClaimForm";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTargets } from "../hooks/useTargets";

export const Claims = () => {
  const { address, chainId } = useDHConnect();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const target = useTargets();

  const [reason, setReason] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [receiver, setReceiver] = useState<string>(address || "");
  const [alternateReceiverCheck, setAlternateReceiverCheck] =
    useState<boolean>(false);

  const { cookieAddress, cookieChain } = useParams();

  //   const { isIdle, isLoading, error, data, hasClaimed, canClaim, isMember, refetch } =
  const { isIdle, isLoading, error, data, hasClaimed, canClaim, refetch } =
    useCookieJar({
      cookieJarAddress: cookieAddress,
      userAddress: address,
      chainId: target?.CHAIN_ID,
    });

  const isGnosis = chainId === target?.CHAIN_ID;

  if (isIdle)
    return (
      <DisplayClaim
        heading="Connect Your Wallet"
        description="You need to connect your wallet in order to see if you are eligable for a claim"
      />
    );
  if (!isGnosis) {
    return (
      <DisplayClaim
        heading="Connect to Gnosis Chain"
        description="Cookie Jar is only on Gnosis Chain."
      />
    );
  }

  if (isLoading)
    return (
      <DisplayClaim
        heading="Loading Claim Data"
        description="Please wait while we load your claim data"
        element={<Spinner size="12rem" />}
      />
    );
  if (error)
    return (
      <DisplayClaim
        heading="Error"
        description={"Error fetching claim data from network RPC"}
      />
    );
  //   if (!isMember)
  //     return (
  //       <DisplayClaim
  //         heading="You must be a member"
  //         description={'Your are not a member or do not have enough cookie to meet the claim threshold.'}
  //       />
  //     );
  // Has Claimed, but needs to wait for the next claim period
  if (data && hasClaimed && !canClaim)
    return (
      <DisplayClaim
        heading="Time until next claim period."
        description="You have already claimed your cookie. You will be able to claim again in the next claim period."
        element={
          <>
            {showConfetti && (
              <Confetti
                width={width}
                height={height}
                gravity={0.05}
                recycle={false}
                numberOfPieces={100}
                tweenDuration={20000}
                colors={[
                  "#f5deb3",
                  "#e6c281",
                  "#8a6015",
                  "#f44336",
                  "#e91e63",
                  "#9c27b0",
                  "#673ab7",
                  "#3f51b5",
                  "#2196f3",
                  "#03a9f4",
                  "#00bcd4",
                  "#009688",
                  "#4CAF50",
                  "#8BC34A",
                  "#CDDC39",
                  "#FFEB3B",
                  "#FFC107",
                  "#FF9800",
                  "#FF5722",
                  "#795548",
                ]}
                onConfettiComplete={() => setShowConfetti(false)}
                drawShape={(ctx) => {
                  // Draw the cookie
                  ctx.beginPath();
                  // ctx.fillStyle = '#f5deb3';
                  ctx.arc(40, 40, 32, 0, 2 * Math.PI);
                  ctx.fill();

                  // Draw the chocolate chips
                  const numChips = 15;

                  for (let i = 0; i < numChips; i++) {
                    let randomSize = Math.floor(Math.random() * 2.4) + 1.6;
                    let chipSize = randomSize;
                    let chipX =
                      Math.floor(Math.random() * (80 - chipSize * 2)) +
                      chipSize;
                    let chipY =
                      Math.floor(Math.random() * (80 - chipSize * 2)) +
                      chipSize;

                    // Check if the chip is inside the cookie
                    let dX = chipX - 40;
                    let dY = chipY - 40;
                    let distance = Math.sqrt(dX * dX + dY * dY);
                    if (distance + chipSize <= 32) {
                      // The chip is inside the cookie, so draw it
                      ctx.beginPath();
                      ctx.fillStyle = "#8b4513";
                      ctx.arc(chipX, chipY, chipSize, 0, 2 * Math.PI);
                      ctx.fill();
                    }
                  }
                }}
              />
            )}
            <Countdown
              claimPeriod={data.claimPeriod}
              lastClaimed={data.lastClaimed}
            />
            <ClaimDetails
              claimAmt={data.claimAmt}
              claimPeriod={data.claimPeriod}
              unit={
                target ? HAUS_NETWORK_DATA[target.CHAIN_ID]?.symbol || "" : ""
              }
            />
          </>
        }
      />
    );
  // Has not claimed
  if (data && !hasClaimed)
    return (
      <SingleColumnLayout>
        <ClaimDetails
          claimAmt={data.claimAmt}
          claimPeriod={data.claimPeriod}
          unit={target ? HAUS_NETWORK_DATA[target.CHAIN_ID]?.symbol || "" : ""}
        />
        <ClaimForm
          user={address}
          cookieAddress={cookieAddress}
          onSuccess={() => {
            refetch();
            setShowConfetti(true);
          }}
        />
      </SingleColumnLayout>
    );
  if (data && canClaim)
    return (
      <SingleColumnLayout>
        <ClaimDetails
          claimAmt={data.claimAmt}
          claimPeriod={data.claimPeriod}
          unit={target ? HAUS_NETWORK_DATA[target.CHAIN_ID]?.symbol || "" : ""}
        />
        <ClaimForm
          user={address}
          cookieAddress={cookieAddress}
          onSuccess={() => {
            refetch();
            setShowConfetti(true);
          }}
        />
      </SingleColumnLayout>
    );

  return null;
};

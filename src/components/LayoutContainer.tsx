import { useDHConnect } from "@daohaus/connect";
import { TXBuilder } from "@daohaus/tx-builder";
import { H4 } from "@daohaus/ui";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { CookieLayout } from "./CookieLayout";
import { StyledRouterLink } from "./Layout";
import { useTargets } from "../hooks/useTargets";

/**
 * LayoutContainer component that wraps the entire application with a CookieLayout.
 *
 * @returns {JSX.Element} The JSX for the LayoutContainer component.
 */
export const LayoutContainer = () => {
  // Hooks
  const location = useLocation();
  const {
    proposalId,
    memberAddress,
    cookieAddress,
    safeAddress,
    daoAddress,
    cookieChain,
  } = useParams<{
    proposalId: string;
    memberAddress: string;
    cookieAddress: string;
    safeAddress: string;
    daoAddress: string;
    cookieChain: string;
  }>();
  const { publicClient, address } = useDHConnect();
  const target = useTargets();

  // Render
  return (
    <CookieLayout
      pathname={location.pathname}
      navLinks={[
        { label: "Home", href: `/` },
        // { label: "Safes", href: `${routePath}/safes` },
        ///{ label: "Allow List", href: `/members` },
        { label: "Claim", href: `/claims/${cookieChain}/${cookieAddress}` },
        { label: "Stats", href: `/history/${cookieChain}/${cookieAddress}` },
        { label: "Config", href: `/config/${cookieChain}/${cookieAddress}` },
        { label: "AllowList", href: `/manage/${cookieChain}/${cookieAddress}` },
      ]}
      leftNav={
        <div>
          <StyledRouterLink to="/">
            <H4>Cookie Jar</H4>
          </StyledRouterLink>
        </div>
      }
    >
      <TXBuilder
        publicClient={publicClient}
        chainId={target?.CHAIN_ID}
        appState={{ memberAddress: address }}
      >
        <Outlet />
      </TXBuilder>
    </CookieLayout>
  );
};

import { Routes as Router, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LayoutContainer } from "./components/LayoutContainer";
import { Claims } from "./pages/Claim";
import { History } from "./pages/History";
import { Jars } from "./pages/Jars";
import { CreateJar } from "./pages/CreateJar";
import { CreateNFTJar } from "./pages/CreateNftJar";
import { ConfigForm } from "./components/ConfigForm";
import { ManageForm } from "./components/ManageForm";

export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
        <Route index element={<Home />} />

        {/* <Route path={`${routePath}/safes`} element={<Safes />} /> */}

        <Route path={`/claims/:cookieJarId`} element={<Claims />} />
        <Route path={`/history/:cookieJarId`} element={<History />} />
        <Route path={`/config/:cookieJarId`} element={<ConfigForm />} />
        <Route path={`/manage/:cookieJarId`} element={<ManageForm />} />
        <Route path={`/jars`} element={<Jars />} />
        <Route path={`/create`} element={<CreateJar />} />
        <Route path={`/mint`} element={<CreateNFTJar />} />
      </Route>
    </Router>
  );
};

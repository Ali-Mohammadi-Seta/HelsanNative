// components/AppRoutes.tsx
import { Route, Routes } from "react-router";
import * as pathRoute from "@/routes/pathRoutes";
import PublicLayout from "@/layouts/publicLayout";
import HomePage from "@/pages/public";
import Breadcrumbs from "@/components/breadCrumbs";
import LoginRegister from "@/pages/auth/LoginRegister";
import MedicalCenters from "@/pages/public/MedicalCenters";
import HealthcareCompanies from "@/pages/public/HealthcareCompanies";
import PharmaciesCompanies from "@/pages/public/PharmaciesCompanies";
import InsurancesCompanies from "@/pages/public/InsurancesCompanies";
import MapLocator from "@/pages/public/mapLocator";
import Profile from "@/pages/panel/profile";
import MyEMRPage from "@/pages/userEMR";
import LoginLayout from "@/layouts/loginLayout/loginLayout";
import { PrivateRoutes } from "@/routes/privateRoutes";
import EmptyLayout from "@/layouts/emptyLayout";
import NotFound from "@/pages/notFound";
import PanelLayout from "@/layouts/PanelLayout";

export const AppRoutes = () => {
  const breadcrumbRoutes = [
    /^\/clinic\/[^/]+\/subclinic\/[^/]+$/,
    /^\/clinic\/[^/]+$/,
  ];

  const showBreadcrumbs = breadcrumbRoutes.some((route) =>
    route.test(location.pathname)
  );

  return (
    <Routes>
      {showBreadcrumbs && <Breadcrumbs />}
      <Route element={<PublicLayout />}>
        <Route path={pathRoute.homePagePath} element={<HomePage />} />
        <Route path={pathRoute.medicalCenter} element={<MedicalCenters />} />
        <Route
          path={pathRoute.healthcareCompanies}
          element={<HealthcareCompanies />}
        />
        <Route
          path={pathRoute.pharmaciesCompanies}
          element={<PharmaciesCompanies />}
        />
        <Route
          path={pathRoute.insurancesCompanies}
          element={<InsurancesCompanies />}
        />
        <Route path={pathRoute.mapPagePath} element={<MapLocator />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route element={<PanelLayout />}>
          <Route path={pathRoute.profilePagePath} element={<Profile />} />
          <Route path={pathRoute.myEmrPagePath} element={<MyEMRPage />} />
        </Route>
      </Route>
      <Route element={<EmptyLayout />}>
        <Route path={pathRoute.othersPagePath} element={<NotFound />} />
      </Route>
      <Route element={<LoginLayout />}>
        <Route path={pathRoute.loginPagePath} element={<LoginRegister />} />
      </Route>
    </Routes>
  );
};

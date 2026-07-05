import Home from "./home/Home";
import Order from "./order/Order";
import AccountSettings from "./account/AccountSettings";
import ForgetPassword from "./authentication/ForgetPassword";
import ResetPassword from "./authentication/ResetPassword";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Shop from "./shop/Shop";
import Account from "./account/Account";
import AddArticle from "./shop-profile/shop-articles/AddArticle";
import UpdateArticle from "./shop-profile/shop-articles/UpdateArticle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import DyariLogo from "./components/DyariLogo";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import ShopForm from "./authentication/ShopForm";
import AuthLayout from "./components/AuthLayout";
import SkeletonShopInfo from "./skeleton/shop/SkeletonShopInfo";
import ProtectedRoute from "./components/ProtectedRoute";

function StandardLayout() {
  return (
    <>
      <DyariLogo />
      <Outlet />
    </>
  );
}
function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <SkeletonTheme baseColor="#F8F8F8" highlightColor="#FFA500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Signup />} />
            <Route path="/creation-boutique" element={<ShopForm />} />
            <Route path="/mot-de-passe-oublie" element={<ForgetPassword />} />
            <Route
              path="/reinitialiser-mot-de-passe"
              element={<ResetPassword />}
            />
          </Route>
          <Route element={<StandardLayout />}>
            <Route path="/boutique/:shopSlug" element={<Shop />} />
            <Route path="/boutique/:shopSlug/commande" element={<Order />} />
            <Route
              path="/compte"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compte/parametres"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compte/ajouter-article"
              element={
                <ProtectedRoute requireRole="vendor">
                  <AddArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compte/modifier-article/:articleId"
              element={
                <ProtectedRoute requireRole="vendor">
                  <UpdateArticle />
                </ProtectedRoute>
              }
            />
            <Route path="/skeleton" element={<SkeletonShopInfo />} />
            {/* <Route path="/mot-de-passe-oublie" element={<ForgetPassword />} /> */}
          </Route>
        </Routes>
      </SkeletonTheme>
    </AuthProvider>
  );
}

export default App;

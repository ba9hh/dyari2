import Home from "./home/Home";
import VerifyEmail from "./authentication/reset-password/verifyEmail";
import Order from "./order/Order";
import AccountSettings from "./account/AccountSettings";
import SkeletonShop from "./skeleton/home/SkeletonShop";
import ForgetPassword from "./authentication/reset-password/ForgetPassword";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Shop from "./shop/Shop";
import Account from "./account/Account";
import AddArticle from "./account/shop-profile/shop-articles/AddArticle";
import ChangePassword from "./account/shop-profile/shop-settings/ChangePassword";
import UpdateArticle from "./account/shop-profile/shop-articles/UpdateArticle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticlesShop from "./account/shop-profile/shop-articles/ArticlesShop";
import DyariDelivery from "./dyari-delivery/DyariDelivery";
import { Outlet } from "react-router-dom";
import DyariLogo from "./components/DyariLogo";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import RoleSelection from "./components/RoleSelection";
import ShopForm from "./authentication/ShopForm";
import AuthLayout from "./components/AuthLayout";
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
    <>
      <AuthProvider>
        <ToastContainer />
        <SkeletonTheme baseColor="#F8F8F8" highlightColor="#FFA500">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/shop-creation" element={<ShopForm />} />
            </Route>
            <Route element={<StandardLayout />}>
              <Route path="/articles" element={<ArticlesShop />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/order" element={<Order />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/settings" element={<AccountSettings />} />
              <Route
                path="/account/settings/change-password"
                element={<ChangePassword />}
              />
              <Route path="/account/add-article" element={<AddArticle />} />
              <Route
                path="/account/update-article/:articleId"
                element={<UpdateArticle />}
              />
              <Route path="/ratingtest" element={<VerifyEmail />} />
              <Route path="/skeleton" element={<SkeletonShop />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/dyari-delivery" element={<DyariDelivery />} />
            </Route>
          </Routes>
        </SkeletonTheme>
      </AuthProvider>
    </>
  );
}

export default App;

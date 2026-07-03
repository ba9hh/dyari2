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
import ArticlesShop from "./shop-profile/shop-articles/ArticlesShop";
import { Outlet } from "react-router-dom";
import DyariLogo from "./components/DyariLogo";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import ShopForm from "./authentication/ShopForm";
import AuthLayout from "./components/AuthLayout";
import SkeletonShopInfo from "./skeleton/shop/SkeletonShopInfo";
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shop-creation" element={<ShopForm />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route element={<StandardLayout />}>
            <Route path="/articles" element={<ArticlesShop />} />
            <Route path="/shop/:shopSlug" element={<Shop />} />
            <Route path="/shop/order" element={<Order />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/account/add-article" element={<AddArticle />} />
            <Route
              path="/account/update-article/:articleId"
              element={<UpdateArticle />}
            />
            <Route path="/skeleton" element={<SkeletonShopInfo />} />
            {/* <Route path="/forget-password" element={<ForgetPassword />} /> */}
          </Route>
        </Routes>
      </SkeletonTheme>
    </AuthProvider>
  );
}

export default App;

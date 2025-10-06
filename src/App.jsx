import Home from "./home/Home";
import VerifyEmail from "./authentication/reset-password/verifyEmail";
import Order from "./order/Order";
import Settings from "./account/Settings";
import SkeletonShop from "./skeleton/SkeletonShop";
import AuthVendorLogin from "./authentication/authVendorLogin";
import Auth from "./authentication/auth";
import AuthVendor from "./authentication/authVendor";
import AuthCustomer from "./authentication/authCustomer";
import ForgetPassword from "./authentication/reset-password/ForgetPassword";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Shop from "./shop/Shop";
import Account from "./account/Account";
import CreateShop from "./authentication/create-shop/CreateShop";
import AddArticle from "./shop-profile/articles/AddArticle";
import ChangePassword from "./shop-profile/settings/ChangePassword";
import UpdateArticle from "./shop-profile/articles/UpdateArticle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArticlesShop from "./shop-profile/articles/ArticlesShop";
import VerifyPage from "./authentication/create-shop/VerifyPage";
function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <SkeletonTheme baseColor="#F8F8F8" highlightColor="#FFA500">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/articles" element={<ArticlesShop />} />
            <Route path="/createshop" element={<CreateShop />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/order" element={<Order />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/settings" element={<Settings />} />
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/vendor" element={<AuthVendor />} />
            <Route path="/auth/customer" element={<AuthCustomer />} />
            <Route path="/auth/vendor/register" element={<CreateShop />} />
            <Route path="/auth/vendor/login" element={<AuthVendorLogin />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </Routes>
        </SkeletonTheme>
      </AuthProvider>
    </>
  );
}

export default App;

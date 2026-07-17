import { BrowserRouter, Routes, Route } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Provider, useDispatch } from "react-redux";
import store from "./redux/store.js";

import LandingLayout from "./components/layout/LandingLayout";
import Home from "./components/pages/Home";

import { CMSProvider } from "./hooks/useCMS.jsx";
import ExplifiedLabs from "./components/pages/LabsPage.jsx";
import Lurphfe from "./components/pages/LurphPage.jsx";
import MarketplaceDashboard from "./components/pages/Dashboard.jsx";
import ProtectedRoute from "./lib/ProtectedRoute.jsx";
import SummifyLanding from "./components/pages/SummifyLanding.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import { restoreSession } from "./redux/authSlice"; 
import ContactPage from "./components/pages/contactUs.jsx";
import PricingPage from "./components/pages/PaymentPage.jsx";
import CheckoutPage from "./components/pages/Checkout.jsx";
import NeonDrift from "./components/pages/NenDrift.jsx";

const ExplifiedBlog = lazy(() => import("./components/pages/BlogPage"));
const BlogPostDetail = lazy(() => import("./components/pages/BlogPostDetail"));
const DynamicPage = lazy(() => import("./components/pages/DynamicPage"));
const AboutUs = lazy(() => import("./components/pages/About"));
const RefundTerms = lazy(() => import("./components/pages/RefundTerms"));
const Partners = lazy(() => import("./components/pages/Partners"));
const TermsOfService = lazy(() => import("./components/pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));

const PageLoader = () => <div className="min-h-screen bg-transparent"></div>;

function AppRoutes() {
  const dispatch = useDispatch();

  // Restore session on every page load / refresh
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<ExplifiedBlog />} />
            <Route path="blog/:slug" element={<BlogPostDetail />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="refund-terms" element={<RefundTerms />} />
            <Route path="partners" element={<Partners />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="labs" element={<ExplifiedLabs />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="apps/neon-drift" element={<NeonDrift />} />
            <Route
              path="/trello/power-ups/summify"
              element={<SummifyLanding />}
            />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/lurph" element={<Lurphfe />} />
            <Route path=":slug" element={<DynamicPage />} />
          </Route>

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <MarketplaceDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          backgroundColor: "#0f0f0f",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        progressStyle={{ background: "#23b5b5" }}
      />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <CMSProvider>
        <AppRoutes />
      </CMSProvider>
    </Provider>
  );
}

export default App;



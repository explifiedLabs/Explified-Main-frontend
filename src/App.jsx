import { BrowserRouter, Routes, Route } from "react-router"; // FIXED: Changed to react-router-dom
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. EAGERLY LOAD Home & Layout (These must load instantly)
import LandingLayout from "./components/layout/LandingLayout";
import Home from "./components/pages/Home";
import { cmsRoutes } from "./components/routes";
import { CMSProvider } from "./hooks/useCMS.jsx";
import ExplifiedLabs from "./components/pages/LabsPage.jsx";
import { AuthProvider } from "./hooks/AuthContext.jsx";

// 2. LAZY LOAD EVERYTHING ELSE (Drastically reduces initial bundle size)
const ExplifiedBlog = lazy(() => import("./components/pages/BlogPage"));
const BlogPostDetail = lazy(() => import("./components/pages/BlogPostDetail"));
const DynamicPage = lazy(() => import("./components/pages/DynamicPage"));
const AboutUs = lazy(() => import("./components/pages/About"));
const RefundTerms = lazy(() => import("./components/pages/RefundTerms"));
const Partners = lazy(() => import("./components/pages/Partners"));
const TermsOfService = lazy(() => import("./components/pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./components/pages/PrivacyPolicy"));

// Simple lightweight loading spinner for route transitions
// 🔥 Make the lazy-load fallback invisible!
// We don't want a random spinner flashing before the Skeleton loads.
const PageLoader = () => <div className="min-h-screen bg-transparent"></div>;

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingLayout />}>
                <Route index element={<Home />} />

                {/* Lazy-Loaded Blog Routes */}
                <Route path="blog" element={<ExplifiedBlog />} />
                <Route path="blog/:slug" element={<BlogPostDetail />} />

                {/* Lazy-Loaded Hardcoded Pages */}
                <Route path="about" element={<AboutUs />} />
                <Route path="refund-terms" element={<RefundTerms />} />
                <Route path="partners" element={<Partners />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />

                <Route path="labs" element={<ExplifiedLabs />} />

                {/* Magic Dynamic Catch-All Route */}
                <Route path=":slug" element={<DynamicPage />} />
              </Route>

              {cmsRoutes}
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
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;

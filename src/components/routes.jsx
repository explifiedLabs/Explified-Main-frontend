import { lazy, Suspense } from "react";
import { Route, Navigate, Outlet } from "react-router";
import { Provider, useSelector } from "react-redux";
import { store } from "../app/store";

import PageLoader from "../cms/layout/PageLoader";
import { DraftsPage } from "../cms/pages/Draft";
import { ArchivePage } from "../cms/pages/Archieve";
import { DeletedPage } from "../cms/pages/Delete";

const AdminLogin = lazy(() => import("../cms/pages/Login"));
const AdminLayout = lazy(() => import("../cms/layout/AdminLayout"));
const Dashboard = lazy(() => import("../cms/pages/Dashboard"));
const Posts = lazy(() => import("../cms/pages/Posts"));
const ProfileSettingsModal = lazy(() => import("../cms/pages/Settings"));
const UsersManagement = lazy(() => import("../cms/pages/Users"));
const CreatePostPage = lazy(() => import("../cms/pages/CreatePost"));
const EditPostPage = lazy(() => import("../cms/pages/EditPost"));
// ✅ ADDED PREVIEW IMPORT
const PreviewPostPage = lazy(() => import("../cms/pages/PreviewPost")); 

const CmsReduxProvider = () => {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
};

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (!user) return <Navigate to="/admin" replace />;
  return children;
};

export const cmsRoutes = (
  <Route element={<CmsReduxProvider />}>
    <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />

    <Route path="/admin/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout /></Suspense></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="posts" element={<Posts />} />
      <Route path="settings" element={<ProfileSettingsModal />} />
      <Route path="users" element={<UsersManagement />} />
      <Route path="create-blog" element={<CreatePostPage />} />
      <Route path="edit-blog/:id" element={<EditPostPage />} />
      
      {/* ✅ ADDED PREVIEW ROUTE HERE */}
      <Route path="preview/:id" element={<PreviewPostPage />} />

      <Route path="drafts" element={<DraftsPage />} />
      <Route path="archive" element={<ArchivePage />} />
      <Route path="deleted" element={<DeletedPage />} />
    </Route>
  </Route>
);
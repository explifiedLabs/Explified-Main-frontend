import axios from "axios";

const API_URL = "https://cmsapi-pf6diz22ka-uc.a.run.app/api/posts/";
const MEDIA_URL = "https://cmsapi-pf6diz22ka-uc.a.run.app/api/media/";

/* ================================
   POSTS
================================ */

// CREATE POST
const createPost = async (data) => {
  const res = await axios.post(
    `${API_URL}create`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

// UPDATE POST
const updatePost = async ({ id, data }) => {
  const res = await axios.put(
    `${API_URL}${id}`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

// PUBLISH POST
const publishPost = async (id) => {
  const res = await axios.patch(
    `${API_URL}publish/${id}`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

// ARCHIVE POST
const archivePost = async (id) => {
  const res = await axios.patch(
    `${API_URL}archive/${id}`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

// SOFT DELETE
const softDeletePost = async (id) => {
  const res = await axios.delete(
    `${API_URL}soft-delete/${id}`,
    { withCredentials: true }
  );
  return res.data;
};

// HARD DELETE
const hardDeletePost = async (id) => {
  const res = await axios.delete(
    `${API_URL}hard-delete/${id}`,
    { withCredentials: true }
  );
  return res.data;
};

// GET ADMIN POSTS
const getAdminPosts = async (params) => {
  const res = await axios.get(
    `${API_URL}admin/all`,
    {
      params,
      withCredentials: true,
    }
  );
  return res.data;
};

/* ================================
   MEDIA (CLOUDINARY)
================================ */

// FETCH ALL MEDIA
const fetchAllMedia = async () => {
  const res = await axios.get(
    `${MEDIA_URL}`,
    { withCredentials: true }
  );
  return res.data; // { total, images }
};

const postService = {
  createPost,
  updatePost,
  publishPost,
  archivePost,
  softDeletePost,
  hardDeletePost,
  getAdminPosts,
  fetchAllMedia,
};

export default postService;
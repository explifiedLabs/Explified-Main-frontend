import axios from "axios";

const API_URL = "https://cmsapi-pf6diz22ka-uc.a.run.app/api/auth/";

const getMembers = async () => {
  const res = await axios.get(`${API_URL}members`, {
    withCredentials: true,
  });
  return res.data;
};

const addMember = async (data) => {
  const res = await axios.post(`${API_URL}members`, data, {
    withCredentials: true,
  });
  return res.data;
};

const updateProfile = async ({ id, data }) => {
  const res = await axios.put(
    `${API_URL}profile/${id}`,
    data,
    { withCredentials: true }
  );
  return res.data;
};

const updateRole = async ({ id, role }) => {
  const res = await axios.put(
    `${API_URL}role/${id}`,
    { role },
    { withCredentials: true }
  );
  return res.data;
};

const updateStatus = async ({ id, isActive }) => {
  const res = await axios.put(
    `${API_URL}status/${id}`,
    { isActive },
    { withCredentials: true }
  );
  return res.data;
};

const resetPassword = async ({ id, newPassword }) => {
  const res = await axios.put(
    `${API_URL}change-password/${id}`,
    { newPassword },
    { withCredentials: true }
  );
  return res.data;
};

const deleteMember = async (id) => {
  const res = await axios.delete(
    `${API_URL}members/${id}`,
    { withCredentials: true }
  );
  return res.data;
};

const memberService = {
  getMembers,
  addMember,
  updateProfile,
  updateRole,
  updateStatus,
  resetPassword,
  deleteMember,
};

export default memberService;
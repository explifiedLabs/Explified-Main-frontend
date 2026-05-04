import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import memberService from "../../services/memberService";

const initialState = {
  users: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

/* ================= THUNKS ================= */

export const fetchMembers = createAsyncThunk(
  "members/fetch",
  async (_, thunkAPI) => {
    try {
      return await memberService.getMembers();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const createMember = createAsyncThunk(
  "members/create",
  async (data, thunkAPI) => {
    try {
      return await memberService.addMember(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "members/updateProfile",
  async ({ id, data }, thunkAPI) => {
    try {
      return await memberService.updateProfile({ id, data });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

export const changeRole = createAsyncThunk(
  "members/changeRole",
  async ({ id, role }, thunkAPI) => {
    try {
      return await memberService.updateRole({ id, role });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Role change failed"
      );
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "members/toggleStatus",
  async ({ id, isActive }, thunkAPI) => {
    try {
      return await memberService.updateStatus({ id, isActive });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Status update failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "members/resetPassword",
  async ({ id, newPassword }, thunkAPI) => {
    try {
      return await memberService.resetPassword({ id, newPassword });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Password reset failed"
      );
    }
  }
);

export const removeMember = createAsyncThunk(
  "members/delete",
  async (id, thunkAPI) => {
    try {
      return await memberService.deleteMember(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

/* ================= SLICE ================= */

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    reset: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users || [];
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(createMember.fulfilled, (state, action) => {
        state.users.unshift(action.payload.user);
        state.isSuccess = true;
        state.message = action.payload.message;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.user._id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
        state.isSuccess = true;
        state.message = action.payload.message;
      })

      .addCase(changeRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload.user._id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
        state.isSuccess = true;
      })

      .addCase(toggleStatus.pending, (state, action) => {
        const { id, isActive } = action.meta.arg;
        const user = state.users.find((u) => u._id === id);
        if (user) user.isActive = isActive; // optimistic
      })

      .addCase(removeMember.pending, (state, action) => {
        state.users = state.users.filter(
          (u) => u._id !== action.meta.arg
        ); // optimistic
      })

      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload.message;
      });
  },
});

export const { reset } = memberSlice.actions;
export default memberSlice.reducer;
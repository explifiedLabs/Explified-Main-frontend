import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postServices"; // Ensure path is correct

/* ================================
   POST THUNKS
================================ */

export const createPostThunk = createAsyncThunk(
  "posts/create",
  async (data, thunkAPI) => {
    try {
      return await postService.createPost(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create failed"
      );
    }
  }
);

export const updatePostThunk = createAsyncThunk(
  "posts/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await postService.updatePost({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed"
      );
    }
  }
);

export const publishPostThunk = createAsyncThunk(
  "posts/publish",
  async (id, thunkAPI) => {
    try {
      return await postService.publishPost(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Publish failed"
      );
    }
  }
);

export const archivePostThunk = createAsyncThunk(
  "posts/archive",
  async (id, thunkAPI) => {
    try {
      return await postService.archivePost(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Archive failed"
      );
    }
  }
);

export const softDeletePostThunk = createAsyncThunk(
  "posts/softDelete",
  async (id, thunkAPI) => {
    try {
      return await postService.softDeletePost(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Soft delete failed"
      );
    }
  }
);

export const hardDeletePostThunk = createAsyncThunk(
  "posts/hardDelete",
  async (id, thunkAPI) => {
    try {
      return await postService.hardDeletePost(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Hard delete failed"
      );
    }
  }
);

export const getAdminPostsThunk = createAsyncThunk(
  "posts/getAdmin",
  async (params, thunkAPI) => {
    try {
      return await postService.getAdminPosts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

/* ================================
   MEDIA THUNK (INSIDE POSTS)
================================ */

export const fetchMediaThunk = createAsyncThunk(
  "posts/fetchMedia",
  async (_, thunkAPI) => {
    try {
      return await postService.fetchAllMedia();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Media fetch failed"
      );
    }
  }
);

/* ================================
   SLICE
================================ */

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1,
    media: [],
    mediaTotal: 0,
    loading: false,
    mediaLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ===== CREATE ===== */
      .addCase(createPostThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPostThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Check if backend returns nested {post: {...}} or direct {...}
        const newPost = action.payload.post || action.payload; 
        state.posts.unshift(newPost);
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== PUBLISH ===== */
      .addCase(publishPostThunk.fulfilled, (state, action) => {
        const updated = action.payload.post || action.payload;
        const index = state.posts.findIndex(
          (p) => p._id === updated._id || p.id === updated._id
        );
        if (index !== -1) state.posts[index] = updated;
      })

      /* ===== UPDATE ===== */
      .addCase(updatePostThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePostThunk.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ FIXED: Safely extract updated post object
        const updated = action.payload.post || action.payload; 

        // ✅ FIXED: Safely match by _id or id
        const index = state.posts.findIndex(
          (p) => p._id === updated._id || p.id === updated._id
        );

        if (index !== -1) {
          state.posts[index] = updated;
        }
      })
      .addCase(updatePostThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== ARCHIVE ===== */
      .addCase(archivePostThunk.fulfilled, (state, action) => {
        const updated = action.payload.post || action.payload;
        const index = state.posts.findIndex(
          (p) => p._id === updated._id || p.id === updated._id
        );
        if (index !== -1) state.posts[index] = updated;
      })

      /* ===== SOFT DELETE ===== */
      .addCase(softDeletePostThunk.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (p) => p._id !== action.meta.arg && p.id !== action.meta.arg
        );
      })

      /* ===== HARD DELETE ===== */
      .addCase(hardDeletePostThunk.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (p) => p._id !== action.meta.arg && p.id !== action.meta.arg
        );
      })

      /* ===== GET ADMIN ===== */
      .addCase(getAdminPostsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminPostsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalPosts = action.payload.totalPosts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })

      /* ===== FETCH MEDIA ===== */
      .addCase(fetchMediaThunk.pending, (state) => {
        state.mediaLoading = true;
      })
      .addCase(fetchMediaThunk.fulfilled, (state, action) => {
        state.mediaLoading = false;
        state.media = action.payload.images;
        state.mediaTotal = action.payload.total;
      })
      .addCase(fetchMediaThunk.rejected, (state, action) => {
        state.mediaLoading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
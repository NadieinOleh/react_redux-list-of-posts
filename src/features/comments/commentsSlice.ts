/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../../types/Comment';
import { getPostComments } from '../../api/comments';

type InitialState = {
  loaded: boolean;
  hasError: boolean;
  items: Comment[];
};

const initialState: InitialState = {
  loaded: false,
  hasError: false,
  items: [],
};

export const loadComments = createAsyncThunk('comments/fetch', (id: number) => {
  return getPostComments(id);
});

const commentsSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Comment>) => {
      state.items.push(action.payload);
    },
    remove: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(({ id }) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadComments.pending,
      (state) => {
        state.loaded = true;
        state.hasError = false;
      });

    builder.addCase(loadComments.fulfilled,
      (state, action) => {
        state.loaded = false;
        state.items = action.payload;
        state.hasError = false;
      });

    builder.addCase(loadComments.rejected,
      (state) => {
        state.loaded = false;
        state.hasError = true;
      });
  },
});

export default commentsSlice.reducer;
export const { add, remove } = commentsSlice.actions;
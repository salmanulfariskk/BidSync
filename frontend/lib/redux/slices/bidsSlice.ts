import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axios';

export interface Bid {
  id: string;
  projectId: string;
  sellerId: string;
  seller?: {
    id: string;
    name: string;
    email?: string;
  };
  amount: number;
  deliveryTime: number; // in days
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

interface BidsState {
  bids: Bid[];
  projectBids: Record<string, Bid[]>;
  currentBid: Bid | null;
  loading: boolean;
  error: string | null;
}

const initialState: BidsState = {
  bids: [],
  projectBids: {},
  currentBid: null,
  loading: false,
  error: null,
};

// Get all bids for a seller
export const fetchSellerBids = createAsyncThunk('bids/fetchSellerBids', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/bids/seller');
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch seller bids');
  }
});

// Get bids for a specific project
export const fetchProjectBids = createAsyncThunk(
  'bids/fetchProjectBids',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/projects/${projectId}/bids`);
      return { projectId, bids: response.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch project bids');
    }
  }
);

// Create a new bid
export const createBid = createAsyncThunk(
  'bids/createBid',
  async (
    bidData: {
      projectId: string;
      amount: number;
      deliveryTime: number;
      message: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/bids', bidData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create bid');
    }
  }
);

// Update an existing bid
export const updateBid = createAsyncThunk(
  'bids/updateBid',
  async (
    {
      id,
      bidData,
    }: {
      id: string;
      bidData: {
        amount?: number;
        deliveryTime?: number;
        message?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/bids/${id}`, bidData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update bid');
    }
  }
);

// Delete a bid
export const deleteBid = createAsyncThunk('bids/deleteBid', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/bids/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete bid');
  }
});

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearCurrentBid: (state) => {
      state.currentBid = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch seller bids
      .addCase(fetchSellerBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerBids.fulfilled, (state, action: PayloadAction<Bid[]>) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchSellerBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch project bids
      .addCase(fetchProjectBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectBids.fulfilled,
        (state, action: PayloadAction<{ projectId: string; bids: Bid[] }>) => {
          state.loading = false;
          const { projectId, bids } = action.payload;
          state.projectBids = {
            ...state.projectBids,
            [projectId]: bids,
          };
        }
      )
      .addCase(fetchProjectBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create bid
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        state.loading = false;
        state.bids.push(action.payload);
        
        // Update project bids if we already have them loaded
        const projectId = action.payload.projectId;
        if (state.projectBids[projectId]) {
          state.projectBids[projectId] = [...state.projectBids[projectId], action.payload];
        }
      })
      .addCase(createBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update bid
      .addCase(updateBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        state.loading = false;
        state.bids = state.bids.map((bid) => (bid.id === action.payload.id ? action.payload : bid));
        
        // Update in project bids if present
        const projectId = action.payload.projectId;
        if (state.projectBids[projectId]) {
          state.projectBids[projectId] = state.projectBids[projectId].map((bid) =>
            bid.id === action.payload.id ? action.payload : bid
          );
        }
      })
      .addCase(updateBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete bid
      .addCase(deleteBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBid.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const bidToRemove = state.bids.find((bid) => bid.id === action.payload);
        
        state.bids = state.bids.filter((bid) => bid.id !== action.payload);
        
        // Remove from project bids if present
        if (bidToRemove) {
          const projectId = bidToRemove.projectId;
          if (state.projectBids[projectId]) {
            state.projectBids[projectId] = state.projectBids[projectId].filter(
              (bid) => bid.id !== action.payload
            );
          }
        }
      })
      .addCase(deleteBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentBid } = bidsSlice.actions;

export default bidsSlice.reducer;
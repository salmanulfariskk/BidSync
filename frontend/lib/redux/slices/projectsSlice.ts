import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axios';

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  buyerId: string;
  buyer?: {
    id: string;
    name: string;
  };
  sellerId?: string;
  seller?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  bidCount?: number;
  files?: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Get all projects
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/projects');
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
  }
});

// Get project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/projects/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch project');
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (
    projectData: {
      title: string;
      description: string;
      budget: { min: number; max: number };
      deadline: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/projects', projectData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    {
      id,
      projectData,
    }: {
      id: string;
      projectData: Partial<Project>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update project');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk('projects/deleteProject', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/projects/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

// Select seller for project
export const selectSeller = createAsyncThunk(
  'projects/selectSeller',
  async (
    {
      projectId,
      bidId,
      sellerId,
    }: {
      projectId: string;
      bidId: string;
      sellerId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/projects/${projectId}/select-bid`, { bidId, sellerId });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to select seller');
    }
  }
);

// Mark project as completed
export const completeProject = createAsyncThunk(
  'projects/completeProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/projects/${projectId}/complete`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to complete project');
    }
  }
);

// Upload files to a project
export const uploadProjectFiles = createAsyncThunk(
  'projects/uploadFiles',
  async ({ projectId, files }: { projectId: string; files: File[] }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post(`/projects/${projectId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload files');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        );
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.projects = state.projects.filter((project) => project.id !== action.payload);
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Select seller
      .addCase(selectSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectSeller.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        );
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(selectSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Complete project
      .addCase(completeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        );
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(completeProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Upload files
      .addCase(uploadProjectFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProjectFiles.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        );
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(uploadProjectFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProject } = projectsSlice.actions;

export default projectsSlice.reducer;
import apiClient from './apiClient';


const USER_API = '/users';

export const userService = {

  createUser: async (userData) => {
    try {
      const response = await apiClient.post(`${USER_API}/create-user`, 
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUserProfile: async (email) => {
    try {
      const response = await apiClient.get(`${USER_API}/profile`, {
        headers: {
          'X-User-Email': email,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  getCurrentUserProfile: async (email) => {
    try {
      const response = await apiClient.get(`${USER_API}/me`, {
        headers: {
          'X-User-Email': email,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`${USER_API}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await apiClient.get(USER_API);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await apiClient.put(
        `${USER_API}/${userId}/status`,
        {},
        {
          params: {
            isActive,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId} status:`, error);
      throw error;
    }
  },




  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`${USER_API}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  updateUserProfile: async (userId, updateData) => {
    try {
      const response = await apiClient.put(
        `${USER_API}/${userId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId} profile:`, error);
      throw error;
    }
  },

  searchAndFilterUsers: async (filters = {}, pagination = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.fullName) params.append('fullName', filters.fullName);
      if (filters.email) params.append('email', filters.email);
      if (filters.phone) params.append('phone', filters.phone);
      if (filters.role && filters.role !== 'ALL') params.append('role', filters.role);
      if (filters.isActive !== undefined && filters.isActive !== null) 
        params.append('isActive', filters.isActive);
      
      params.append('pageNumber', pagination.pageNumber || 0);
      params.append('pageSize', pagination.pageSize || 10);
      params.append('sortBy', pagination.sortBy || 'fullName');
      params.append('sortOrder', pagination.sortOrder || 'ASC');

      const response = await apiClient.get(`${USER_API}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching/filtering users:', error);
      throw error;
    }
  },
};


export const mapBackendUserToFrontendModel = (
  backendUser,
  defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed='
) => {
  return {
    id: String(backendUser.id),
    name: backendUser.fullName,
    email: backendUser.email,
    phone: backendUser.phone || '',
    role: backendUser.role,
    active: backendUser.isActive !== undefined ? backendUser.isActive : true,
    lastLoginAt: backendUser.lastLoginAt,
    avatar: `${defaultAvatar}${backendUser.email}`,
    passport: '',
  };
};


export const mapBackendUsersToFrontendModels = (
  backendUsers,
  defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed='
) => {
  return backendUsers.map((user) =>
    mapBackendUserToFrontendModel(user, defaultAvatar)
  );
};

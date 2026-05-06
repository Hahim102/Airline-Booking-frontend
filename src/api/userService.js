import apiClient from './apiClient';


const USER_API = '/users';

export const userService = {

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

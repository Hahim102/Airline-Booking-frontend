import { useState, useCallback, useEffect } from 'react';
import {
  userService,
  mapBackendUsersToFrontendModels,
  mapBackendUserToFrontendModel,
} from '../api/userService';


export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUsers = await userService.getAllUsers();
      const frontendUsers = mapBackendUsersToFrontendModels(backendUsers);
      setUsers(frontendUsers);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to fetch users';
      setError(errorMessage);
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchUserById = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const backendUser = await userService.getUserById(userId);
      return mapBackendUserToFrontendModel(backendUser);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to fetch user';
      setError(errorMessage);
      console.error(`Failed to fetch user ${userId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchUserProfile = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);
      const backendUser = await userService.getUserProfile(email);
      return mapBackendUserToFrontendModel(backendUser);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to fetch user profile';
      setError(errorMessage);
      console.error(`Failed to fetch user profile:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const updateUserStatus = useCallback(async (userId, isActive) => {
    try {
      setError(null);
      await userService.updateUserStatus(userId, isActive);


      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === String(userId) ? { ...user, active: isActive } : user
        )
      );

      return true;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to update user status';
      setError(errorMessage);
      console.error(`Failed to update user ${userId} status:`, err);
      throw err;
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      setError(null);
      const backendUser = await userService.createUser(userData);
      const frontendUser = mapBackendUserToFrontendModel(backendUser);
      setUsers((prevUsers) => [...prevUsers, frontendUser]);
      return frontendUser;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to create user';
      setError(errorMessage);
      console.error('Failed to create user:', err);
      throw err;
    }
  }, []);


  const deleteUserById = useCallback(async (userId) => {
    try {
      setError(null);
      await userService.deleteUser(userId);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== String(userId))
      );

      return true;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to delete user';
      setError(errorMessage);
      console.error(`Failed to delete user ${userId}:`, err);
      throw err;
    }
  }, []);



  const searchUsers = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      return users;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.id.includes(searchTerm)
    );
  }, [users]);

  const searchAndFilterUsers = useCallback(async (filters = {}, pagination = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.searchAndFilterUsers(filters, pagination);
      
      const usersList = response.content || response;
      const frontendUsers = mapBackendUsersToFrontendModels(usersList);
      
      return {
        users: frontendUsers,
        totalElements: response.totalElements || frontendUsers.length,
        totalPages: response.totalPages || 1,
        currentPage: response.number || 0,
        pageSize: response.size || frontendUsers.length,
      };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to search/filter users';
      setError(errorMessage);
      console.error('Failed to search/filter users:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (userId, updateData) => {
    try {
      setError(null);
      const backendUser = await userService.updateUserProfile(userId, updateData);
      const frontendUser = mapBackendUserToFrontendModel(backendUser);
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === String(userId) ? frontendUser : user
        )
      );

      return frontendUser;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error || err?.message || 'Failed to update user profile';
      setError(errorMessage);
      console.error(`Failed to update user profile:`, err);
      throw err;
    }
  }, []);

  return {
    users,
    setUsers,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    fetchUserProfile,
    updateUserStatus,
    createUser,
    deleteUserById,
    searchUsers,
    searchAndFilterUsers,
    updateUserProfile,
  };
};

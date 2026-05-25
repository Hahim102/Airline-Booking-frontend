import apiClient from './apiClient';

const ANALYTICS_API = '/analytics';

export const analyticsService = {
  
  getSummary: async () => {
    try {
      const response = await apiClient.get(`${ANALYTICS_API}/summary`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching summary:', error);
      throw error;
    }
  },

  getRegistrations: async (type = 'DAY') => {
    try {
      const response = await apiClient.get(`${ANALYTICS_API}/registrations`, {
        params: { type }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching registrations:', error);
      throw error;
    }
  }
};

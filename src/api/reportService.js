import apiClient from './apiClient';

const EXPORT_API = '/export';

export const reportService = {
  exportUsersExcel: async () => {
    try {
      const response = await apiClient.get(`${EXPORT_API}/users/excel`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting users to Excel:', error);
      throw error;
    }
  },

  exportUsersPdf: async () => {
    try {
      const response = await apiClient.get(`${EXPORT_API}/users/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting users to PDF:', error);
      throw error;
    }
  },

  exportAnalyticsExcel: async (type = 'DAY') => {
    try {
      const response = await apiClient.get(`${EXPORT_API}/analytics/excel`, {
        params: { type },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics to Excel:', error);
      throw error;
    }
  },

  exportAnalyticsPdf: async (type = 'DAY') => {
    try {
      const response = await apiClient.get(`${EXPORT_API}/analytics/pdf`, {
        params: { type },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting analytics to PDF:', error);
      throw error;
    }
  }
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

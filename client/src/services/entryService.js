import api from './api';

export const entryService = {
  getEntries: async () => {
    const response = await api.get('/entries');
    return response.data;
  },

  getEntryByDate: async (date) => {
    const response = await api.get(`/entries/${date}`);
    return response.data;
  },

  getTodayComparison: async () => {
    const response = await api.get('/entries/today/comparison');
    return response.data;
  },

  getWeeklyStats: async () => {
    const response = await api.get('/entries/stats/weekly');
    return response.data;
  },

  createEntry: async (entryData) => {
    const response = await api.post('/entries', entryData);
    return response.data.entry;
  },

  updateEntry: async (id, entryData) => {
    const response = await api.put(`/entries/${id}`, entryData);
    return response.data.entry;
  },

  deleteEntry: async (id) => {
    await api.delete(`/entries/${id}`);
  }
};
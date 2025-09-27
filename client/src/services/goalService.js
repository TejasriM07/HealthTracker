import api from './api';

export const goalService = {
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  getGoalByDate: async (date) => {
    const response = await api.get(`/goals/${date}`);
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data.goal;
  },

  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data.goal;
  },

  deleteGoal: async (id) => {
    await api.delete(`/goals/${id}`);
  }
};
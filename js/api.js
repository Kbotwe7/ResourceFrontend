const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (email, password) => apiCall('/auth/login', 'POST', { email, password }),
  register: (userData) => apiCall('/auth/register', 'POST', userData),
};

// Resource API
export const resourceAPI = {
  getAll: () => apiCall('/resources'),
  getById: (id) => apiCall(`/resources/${id}`),
  getByCategory: (category) => apiCall(`/resources/category/${category}`),
  create: (resourceData, token) => apiCall('/resources', 'POST', resourceData, token),
  update: (id, resourceData, token) => apiCall(`/resources/${id}`, 'PUT', resourceData, token),
  delete: (id, token) => apiCall(`/resources/${id}`, 'DELETE', null, token),
};

// Booking API
export const bookingAPI = {
  create: (bookingData, token) => apiCall('/bookings', 'POST', bookingData, token),
  getMyBookings: (token) => apiCall('/bookings/my-bookings', 'GET', null, token),
  getAll: (token) => apiCall('/bookings', 'GET', null, token),
  cancel: (id, token) => apiCall(`/bookings/${id}/cancel`, 'PUT', null, token),
  update: (id, bookingData, token) => apiCall(`/bookings/${id}`, 'PUT', bookingData, token),
};

// Admin API
export const adminAPI = {
  getUsers: (token) => apiCall('/admin/users', 'GET', null, token),
  updateUserRole: (id, role, token) => apiCall(`/admin/users/${id}/role`, 'PUT', { role }, token),
  deleteUser: (id, token) => apiCall(`/admin/users/${id}`, 'DELETE', null, token),
  getStats: (token) => apiCall('/admin/stats', 'GET', null, token),
  updateSettings: (settings, token) => apiCall('/admin/settings', 'PUT', settings, token),
}; 
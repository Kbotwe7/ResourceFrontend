import { resourceAPI, adminAPI } from './api.js';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const token = localStorage.getItem('token');

// Load resources
async function loadResources() {
  try {
    const resources = await resourceAPI.getAll();
    const resourceList = document.getElementById('resourceList');
    resourceList.innerHTML = '';

    resources.forEach(resource => {
      const row = document.createElement('tr');
    row.innerHTML = `
        <td>${resource.category}</td>
        <td>${resource.name}</td>
        <td>${resource.status}</td>
        <td>
          <button onclick="editResource('${resource._id}')" class="btn-mini">Edit</button>
          <button onclick="deleteResource('${resource._id}')" class="btn-mini danger">Delete</button>
      </td>
    `;
    resourceList.appendChild(row);
  });
  } catch (error) {
    console.error('Error loading resources:', error);
    alert('Failed to load resources');
  }
}

// Add new resource
async function addResource(event) {
  event.preventDefault();
  const form = event.target;
  const resourceData = {
    name: form.resourceName.value,
    category: form.category.value,
    status: form.status.value,
    description: form.description.value,
    location: form.location.value,
    capacity: form.capacity.value,
    imageUrl: form.imageUrl.value
  };

  try {
    await resourceAPI.create(resourceData, token);
    alert('Resource added successfully');
    form.reset();
    loadResources();
  } catch (error) {
    console.error('Error adding resource:', error);
    alert('Failed to add resource');
  }
}

// Edit resource
async function editResource(id) {
  try {
    const resource = await resourceAPI.getById(id);
    // Populate form with resource data
    const form = document.getElementById('editResourceForm');
    form.resourceId.value = resource._id;
    form.resourceName.value = resource.name;
    form.category.value = resource.category;
    form.status.value = resource.status;
    form.description.value = resource.description;
    form.location.value = resource.location;
    form.capacity.value = resource.capacity;
    form.imageUrl.value = resource.imageUrl;

    // Show edit modal
    document.getElementById('editModal').style.display = 'block';
  } catch (error) {
    console.error('Error loading resource:', error);
    alert('Failed to load resource');
  }
}

// Update resource
async function updateResource(event) {
  event.preventDefault();
  const form = event.target;
  const resourceData = {
    name: form.resourceName.value,
    category: form.category.value,
    status: form.status.value,
    description: form.description.value,
    location: form.location.value,
    capacity: form.capacity.value,
    imageUrl: form.imageUrl.value
  };

  try {
    await resourceAPI.update(form.resourceId.value, resourceData, token);
    alert('Resource updated successfully');
    document.getElementById('editModal').style.display = 'none';
    loadResources();
  } catch (error) {
    console.error('Error updating resource:', error);
    alert('Failed to update resource');
  }
}

// Delete resource
async function deleteResource(id) {
  if (!confirm('Are you sure you want to delete this resource?')) return;

  try {
    await resourceAPI.delete(id, token);
    alert('Resource deleted successfully');
      loadResources();
  } catch (error) {
    console.error('Error deleting resource:', error);
    alert('Failed to delete resource');
  }
}

// Load admin dashboard stats
async function loadAdminStats() {
  try {
    const stats = await adminAPI.getStats(token);
    const statsContainer = document.getElementById('adminStats');
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <h3>Total Users</h3>
          <p>${stats.totalUsers}</p>
        </div>
        <div class="stat-card">
          <h3>Total Resources</h3>
          <p>${stats.totalResources}</p>
        </div>
        <div class="stat-card">
          <h3>Active Bookings</h3>
          <p>${stats.activeBookings}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load bookings for admin view
async function loadBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const bookings = await response.json();
    const bookingsList = document.getElementById('bookingsList');
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredBookings = bookings.filter(booking => {
      const matchesSearch = (booking.student_name.toLowerCase().includes(searchInput) ||
                          booking.resource_name.toLowerCase().includes(searchInput));
      const matchesStatus = !statusFilter || booking.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    bookingsList.innerHTML = filteredBookings.map(booking => `
      <div class="booking-card">
        <div class="booking-card-title">${booking.resource_name}</div>
        <div class="booking-card-detail">
          <strong>Student:</strong> ${booking.student_name}
        </div>
        <div class="booking-card-detail">
          <strong>Date:</strong> ${booking.date}
        </div>
        <div class="booking-card-detail">
          <strong>Time:</strong> ${booking.time}
        </div>
        <div class="booking-card-detail">
          <strong>Duration:</strong> ${booking.duration} hours
        </div>
        <div class="booking-card-status status ${booking.status.toLowerCase()}">
          ${booking.status}
        </div>
        <div class="booking-card-actions">
          ${booking.status === 'Pending' ? `
            <button onclick="updateBookingStatus('${booking.id}', 'Approved')" class="btn-mini success">
              <i class="fas fa-check"></i> Approve
            </button>
            <button onclick="updateBookingStatus('${booking.id}', 'Rejected')" class="btn-mini danger">
              <i class="fas fa-times"></i> Reject
            </button>
          ` : ''}
          <button onclick="deleteBooking('${booking.id}')" class="btn-mini warning">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load bookings');
  }
}

// Update booking status
async function updateBookingStatus(bookingId, newStatus) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }

    loadBookings();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to update booking status');
  }
}

// Delete booking
async function deleteBooking(bookingId) {
  if (!confirm('Are you sure you want to delete this booking?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }

    loadBookings();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to delete booking');
  }
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');

  if (searchInput && statusFilter) {
    searchInput.addEventListener('input', loadBookings);
    statusFilter.addEventListener('change', loadBookings);
    loadBookings();
  }

  if (token) {
    loadResources();
    loadAdminStats();
  } else {
    window.location.href = 'admin_login.html';
  }
});

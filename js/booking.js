// Import localStorage service
import localStorageService from './localStorageService.js';

// Constants
const API_BASE_URL = 'http://localhost:5000/api';

// Get current user from localStorage (should be set during login)
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { id: 1, name: 'Default User' };

document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }

    // Load resources for the dropdown
    loadResources();
});

function loadResources() {
    try {
        const resources = localStorageService.getResources();
        
        const resourceSelect = document.getElementById('resource');
        resources.forEach(resource => {
            const option = document.createElement('option');
            option.value = resource.id;
            option.textContent = `${resource.name} (${resource.type})`;
            resourceSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading resources:', error);
        showError('Failed to load resources. Please try again later.');
    }
}

function handleBookingSubmission(event) {
    event.preventDefault();

    const form = event.target;
    const resourceId = form.resource.value;
    const date = form.date.value;
    const startTime = form.time.value;
    const duration = parseInt(form.duration.value);
    const purpose = form.purpose.value;

    // Calculate end time
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);
      
    const bookingData = {
        user_id: currentUser.id,
        resource_id: parseInt(resourceId),
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        purpose: purpose,
        status: 'Pending'
    };

    try {
        // Check for overlapping bookings
        if (localStorageService.checkOverlappingBookings(bookingData.resource_id, bookingData.start_time, bookingData.end_time)) {
            throw new Error('This time slot is already booked');
        }

        const booking = localStorageService.addBooking(bookingData);
        
        // Store minimal booking details for confirmation page
        localStorage.setItem('lastBooking', JSON.stringify({
            id: booking.id,
            resource_name: localStorageService.getResources().find(r => r.id === booking.resource_id).name,
            start_time: booking.start_time,
            end_time: booking.end_time,
            status: booking.status
        }));
      
        // Redirect to confirmation page
        window.location.href = 'booking-confirmation.html';
    } catch (error) {
        console.error('Error creating booking:', error);
        showError(error.message || 'Failed to create booking. Please try again.');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message);
    }
}

// Load user's bookings
function loadMyBookings() {
    try {
        const currentStudent = JSON.parse(localStorage.getItem('currentStudent'));
        if (!currentStudent) {
            throw new Error('User not logged in');
        }

        const bookings = localStorageService.getBookings()
            .filter(booking => booking.user_id === currentStudent.id)
            .map(booking => {
                const resource = localStorageService.getResources()
                    .find(r => r.id === booking.resource_id);
                return {
                    ...booking,
                    resource_name: resource ? resource.name : 'Unknown Resource'
                };
            });

        const bookingsList = document.getElementById('bookingsList');
        
        if (bookingsList) {
            bookingsList.innerHTML = bookings.map(booking => `
                <div class="booking-card">
                    <h3>${booking.resource_name}</h3>
                    <p>Date: ${new Date(booking.start_time).toLocaleDateString()}</p>
                    <p>Time: ${new Date(booking.start_time).toLocaleTimeString()}</p>
                    <p>Status: ${booking.status}</p>
                    <p>Purpose: ${booking.purpose}</p>
                    ${booking.status === 'Pending' || booking.status === 'Approved' ? `
                        <button onclick="cancelBooking(${booking.id})" class="btn-mini danger">Cancel</button>
                    ` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load bookings');
    }
}

// Cancel booking
function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        localStorageService.updateBooking(id, { status: 'Cancelled' });
        alert('Booking cancelled successfully');
        loadMyBookings();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to cancel booking');
    }
}

// Initialize booking page
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('currentStudent')) {
        window.location.href = 'index.html';
        return;
    }

    // Load user's bookings if on the bookings page
    if (document.getElementById('bookingsList')) {
        loadMyBookings();
    }
});

// Load resource details
function loadResourceDetails(id) {
    try {
        const resource = localStorageService.getResources().find(r => r.id === parseInt(id));
        const resourceInfo = document.getElementById('resourceInfo');
        if (resourceInfo) {
            resourceInfo.innerHTML = `
                <h2>${resource.name}</h2>
                <p>Type: ${resource.type}</p>
                <p>Location: ${resource.location}</p>
                <p>Status: ${resource.status}</p>
                ${resource.description ? `<p>Description: ${resource.description}</p>` : ''}
            `;
        }
    } catch (error) {
        console.error('Error loading resource details:', error);
        alert('Failed to load resource details');
    }
}
  
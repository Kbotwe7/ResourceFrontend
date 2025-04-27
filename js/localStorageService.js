// localStorageService.js
class LocalStorageService {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize tables if they don't exist
        if (!localStorage.getItem('resources')) {
            localStorage.setItem('resources', JSON.stringify([
                {
                    id: 1,
                    name: 'Lecture Room 1',
                    type: 'room',
                    description: 'Main lecture hall with projector',
                    capacity: 100,
                    location: 'Block A, Ground Floor',
                    status: 'Available'
                },
                {
                    id: 2,
                    name: 'Computer Lab',
                    type: 'lab',
                    description: 'Equipped with 30 computers',
                    capacity: 30,
                    location: 'Block B, First Floor',
                    status: 'Available'
                },
                {
                    id: 3,
                    name: 'Projector X20',
                    type: 'equipment',
                    description: 'High-resolution projector',
                    capacity: 1,
                    location: 'Equipment Room',
                    status: 'Available'
                }
            ]));
        }

        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    email: 'admin@example.com'
                },
                {
                    id: 2,
                    username: 'student1',
                    password: 'student123',
                    role: 'student',
                    email: 'student1@example.com'
                }
            ]));
        }

        if (!localStorage.getItem('bookings')) {
            localStorage.setItem('bookings', JSON.stringify([]));
        }
    }

    // Resource operations
    getResources() {
        return JSON.parse(localStorage.getItem('resources') || '[]');
    }

    addResource(resource) {
        const resources = this.getResources();
        resource.id = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
        resources.push(resource);
        localStorage.setItem('resources', JSON.stringify(resources));
        return resource;
    }

    updateResource(id, updates) {
        const resources = this.getResources();
        const index = resources.findIndex(r => r.id === id);
        if (index !== -1) {
            resources[index] = { ...resources[index], ...updates };
            localStorage.setItem('resources', JSON.stringify(resources));
            return resources[index];
        }
        return null;
    }

    deleteResource(id) {
        const resources = this.getResources();
        const filtered = resources.filter(r => r.id !== id);
        localStorage.setItem('resources', JSON.stringify(filtered));
    }

    // User operations
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    }

    addUser(user) {
        const users = this.getUsers();
        user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    }

    // Booking operations
    getBookings() {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    }

    addBooking(booking) {
        const bookings = this.getBookings();
        booking.id = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
        booking.created_at = new Date().toISOString();
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return booking;
    }

    updateBooking(id, updates) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updates };
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return bookings[index];
        }
        return null;
    }

    deleteBooking(id) {
        const bookings = this.getBookings();
        const filtered = bookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(filtered));
    }

    // Check for overlapping bookings
    checkOverlappingBookings(resourceId, startTime, endTime, excludeBookingId = null) {
        const bookings = this.getBookings();
        return bookings.some(booking => {
            if (booking.resource_id === resourceId && 
                booking.status !== 'Cancelled' &&
                booking.id !== excludeBookingId) {
                const bookingStart = new Date(booking.start_time);
                const bookingEnd = new Date(booking.end_time);
                const newStart = new Date(startTime);
                const newEnd = new Date(endTime);

                return (
                    (bookingStart <= newStart && bookingEnd > newStart) ||
                    (bookingStart < newEnd && bookingEnd >= newEnd) ||
                    (bookingStart >= newStart && bookingEnd <= newEnd)
                );
            }
            return false;
        });
    }
}

// Create a singleton instance
const localStorageService = new LocalStorageService();
export default localStorageService; 
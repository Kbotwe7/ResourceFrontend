class DataService {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        try {
            // Initialize localStorage with default data if it doesn't exist
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify([
                    {
                        id: 1,
                        username: 'admin',
                        password: 'admin123',
                        role: 'admin',
                        name: 'Admin User'
                    }
                ]));
            }
            if (!localStorage.getItem('bookings')) {
                localStorage.setItem('bookings', JSON.stringify([]));
            }
            if (!localStorage.getItem('resources')) {
                localStorage.setItem('resources', JSON.stringify([]));
            }
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    }

    // User operations
    addUser(user) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            user.id = Date.now();
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Added new user:', user);
            return user;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    getUserByUsername(username) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username);
            console.log('Found user:', user);
            return user;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    // Booking operations
    addBooking(booking) {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            booking.id = Date.now();
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return booking;
        } catch (error) {
            console.error('Error adding booking:', error);
            throw error;
        }
    }

    getBookingsByUserId(userId) {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            return bookings.filter(b => b.user_id === userId);
        } catch (error) {
            console.error('Error getting bookings:', error);
            return [];
        }
    }

    updateBooking(bookingId, updates) {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const index = bookings.findIndex(b => b.id === bookingId);
            if (index !== -1) {
                bookings[index] = { ...bookings[index], ...updates };
                localStorage.setItem('bookings', JSON.stringify(bookings));
                return bookings[index];
            }
            return null;
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    }

    // Resource operations
    getResources() {
        try {
            return JSON.parse(localStorage.getItem('resources') || '[]');
        } catch (error) {
            console.error('Error getting resources:', error);
            return [];
        }
    }
}

// Create a singleton instance
const dataService = new DataService();
export default dataService; 
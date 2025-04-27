// Data management module for localStorage
const DataManager = {
    // Initialize default resources if none exist
    initializeResources: function() {
        if (!localStorage.getItem('resources')) {
            const defaultResources = [
                {
                    id: '1',
                    name: 'Room 101',
                    type: 'Room',
                    description: 'Lecture room with projector',
                    location: 'Block A, 2nd Floor',
                    capacity: 50,
                    imageUrl: 'images/rooms/lectureroom.jpg',
                    status: 'Available'
                },
                {
                    id: '2',
                    name: 'Room 202',
                    type: 'Room',
                    description: 'Conference room',
                    location: 'Block C, 1st Floor',
                    capacity: 30,
                    imageUrl: 'images/lecture3.jpg',
                    status: 'Available'
                },
                {
                    id: '3',
                    name: 'Projector X20',
                    type: 'Equipment',
                    description: 'High-resolution projector',
                    location: 'Equipment Room 1',
                    imageUrl: 'images/placeholder-equipment.jpg',
                    status: 'Available'
                },
                {
                    id: '4',
                    name: 'Engineering Lab',
                    type: 'Lab',
                    description: 'Hands-on lab for engineering students',
                    location: 'Block B, Ground Floor',
                    imageUrl: 'images/lab-placeholder.jpg',
                    status: 'Available'
                },
                {
                    id: '5',
                    name: 'Basketball Court',
                    type: 'Recreational',
                    description: 'Indoor basketball court',
                    location: 'Sports Complex',
                    imageUrl: 'images/placeholder-recreational.jpg',
                    status: 'Available'
                },
                {
                    id: '6',
                    name: 'Whiteboard Station',
                    type: 'Study Aids',
                    description: 'Includes dry erase markers and board erasers',
                    location: 'Study Hall',
                    imageUrl: 'images/placeholder-study.jpg',
                    status: 'Available'
                }
            ];
            localStorage.setItem('resources', JSON.stringify(defaultResources));
        }
    },

    // Get all resources
    getResources: function() {
        return JSON.parse(localStorage.getItem('resources') || '[]');
    },

    // Add a new resource
    addResource: function(resource) {
        const resources = this.getResources();
        resource.id = Date.now().toString(); // Simple ID generation
        resources.push(resource);
        localStorage.setItem('resources', JSON.stringify(resources));
        return resource;
    },

    // Update a resource
    updateResource: function(id, updates) {
        const resources = this.getResources();
        const index = resources.findIndex(r => r.id === id);
        if (index !== -1) {
            resources[index] = { ...resources[index], ...updates };
            localStorage.setItem('resources', JSON.stringify(resources));
            return resources[index];
        }
        return null;
    },

    // Delete a resource
    deleteResource: function(id) {
        const resources = this.getResources();
        const filteredResources = resources.filter(r => r.id !== id);
        localStorage.setItem('resources', JSON.stringify(filteredResources));
    },

    // Get all bookings
    getBookings: function() {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    },

    // Add a new booking
    addBooking: function(booking) {
        const bookings = this.getBookings();
        booking.id = Date.now().toString(); // Simple ID generation
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        return booking;
    },

    // Update a booking
    updateBooking: function(id, updates) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index] = { ...bookings[index], ...updates };
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return bookings[index];
        }
        return null;
    },

    // Delete a booking
    deleteBooking: function(id) {
        const bookings = this.getBookings();
        const filteredBookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(filteredBookings));
    }
};

// Initialize default data when the script loads
DataManager.initializeResources(); 
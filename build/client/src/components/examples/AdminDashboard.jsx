import AdminDashboard from '../AdminDashboard';
export default function AdminDashboardExample() {
    // Mock dashboard data
    var mockStats = {
        todayBookings: 12,
        activeWashing: 3,
        completedToday: 8,
        todayRevenue: 450000,
        avgServiceTime: 35
    };
    var mockBookings = [
        {
            id: "booking-1",
            serviceName: "Ducha y aspirado",
            vehiclePlate: "ABC-1234",
            date: "2024-03-15",
            timeSlot: "09:00 - 09:30",
            status: 'waiting',
            price: 50000,
            paymentMethod: 'card',
            paymentStatus: 'pending'
        },
        {
            id: "booking-2",
            serviceName: "Lavado + encerado",
            vehiclePlate: "XYZ-5678",
            date: "2024-03-15",
            timeSlot: "10:00 - 10:45",
            status: 'washing',
            price: 70000,
            paymentMethod: 'cash',
            paymentStatus: 'paid'
        },
        {
            id: "booking-3",
            serviceName: "Pulida Comercial",
            vehiclePlate: "DEF-9012",
            date: "2024-03-15",
            timeSlot: "08:00 - 10:00",
            status: 'done',
            price: 300000,
            paymentMethod: 'pix',
            paymentStatus: 'paid'
        }
    ];
    var handleStatusUpdate = function (bookingId, newStatus) {
        console.log('Admin status update:', bookingId, newStatus);
    };
    var handleViewDetails = function (bookingId) {
        console.log('Admin view details:', bookingId);
    };
    return (<AdminDashboard stats={mockStats} todayBookings={mockBookings} onStatusUpdate={handleStatusUpdate} onViewDetails={handleViewDetails}/>);
}

import BookingCard from '../BookingCard';
export default function BookingCardExample() {
    var mockBooking = {
        id: "booking-123",
        serviceName: "Ducha y aspirado",
        vehiclePlate: "ABC-1234",
        date: "2024-03-15",
        timeSlot: "14:00 - 14:30",
        status: 'washing',
        price: 50000,
        paymentMethod: 'card',
        paymentStatus: 'paid'
    };
    var handleStatusUpdate = function (bookingId, newStatus) {
        console.log('Status updated:', bookingId, newStatus);
    };
    var handleViewDetails = function (bookingId) {
        console.log('View details:', bookingId);
    };
    return (<div className="p-4 space-y-4">
      {/* Customer view */}
      <div>
        <h3 className="text-sm font-medium mb-2">Vista Cliente</h3>
        <BookingCard {...mockBooking} onViewDetails={handleViewDetails}/>
      </div>
      
      {/* Admin view */}
      <div>
        <h3 className="text-sm font-medium mb-2">Vista Administrador</h3>
        <BookingCard {...mockBooking} status="waiting" onStatusUpdate={handleStatusUpdate} onViewDetails={handleViewDetails} isAdmin={true}/>
      </div>
    </div>);
}

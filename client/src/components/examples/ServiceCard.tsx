import ServiceCard from '../ServiceCard';

export default function ServiceCardExample() {
  // Mock service data from specifications
  const mockService = {
    id: "wash-vacuum",
    nameKey: "service.washVacuum",
    title: "Ducha y aspirado",
    description: "Shampoo V-Floc",
    prices: {
      auto: 50000,
      suv: 70000,
      camioneta: 100000
    },
    duration: 30,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
  };

  const handleSelect = (serviceId: string) => {
    console.log('Service selected:', serviceId);
  };

  return (
    <div className="p-4">
      <ServiceCard 
        {...mockService}
        onSelect={handleSelect}
      />
    </div>
  );
}
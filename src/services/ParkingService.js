const mockSpots = [
  { id: "1", code: "A-101", status: "occupied",    plate: "XYZ-1234", icon: "directions_car" },
  { id: "2", code: "A-102", status: "occupied",    plate: "ABC-9876", icon: "directions_car" },
  { id: "3", code: "A-103", status: "available" },
  { id: "4", code: "A-104", status: "available" },
  { id: "5", code: "A-105", status: "reserved",    icon: "bookmark" },
  { id: "6", code: "A-106", status: "maintenance", icon: "build" },
  { id: "7", code: "B-201", status: "occupied",    plate: "EV-5542", icon: "electric_car" },
  { id: "8", code: "B-202", status: "available" },
];

export async function getSpots() {
  return Promise.resolve(mockSpots);
}

export async function getOccupancy() {
  const occupied  = mockSpots.filter(s => s.status === "occupied").length;
  const available = mockSpots.filter(s => s.status === "available").length;

  return Promise.resolve({
    occupied,
    available,
    total: mockSpots.length
  });
}
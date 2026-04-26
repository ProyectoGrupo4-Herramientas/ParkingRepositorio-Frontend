export const mockData = [
  {
    id: 1,
    fecha: 'Oct 17, 2023',
    horaEntrada: '08:15 AM',
    horaSalida: '05:30 PM',
    placa: 'XYZ-1234',
    unidad: 'Unit 402',
    tipo: 'Residente',
    duracion: '9h 15m'
  },
  {
    id: 2,
    fecha: 'Oct 17, 2023',
    horaEntrada: '09:00 AM',
    horaSalida: 'Aún dentro',
    placa: 'ABC-9876',
    unidad: 'Unit 105',
    tipo: 'Invitado',
    duracion: '--'
  },
  {
    id: 3,
    fecha: 'Oct 16, 2023',
    horaEntrada: '02:10 PM',
    horaSalida: '02:45 PM',
    placa: 'DLV-555',
    unidad: 'Unit 301',
    tipo: 'Entrega',
    duracion: '35m'
  },
  {
    id: 4,
    fecha: 'Oct 16, 2023',
    horaEntrada: '06:45 PM',
    horaSalida: '07:20 AM',
    placa: 'LMN-4321',
    unidad: 'Unit 510',
    tipo: 'Residente',
    duracion: '12h 35m'
  },
  
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: i + 5,
    fecha: 'Oct 15, 2023',
    horaEntrada: '10:00 AM',
    horaSalida: '11:00 AM',
    placa: `MOC-${1000+i}`,
    unidad: `Unit ${100+i}`,
    tipo: i % 3 === 0 ? 'Residente' : (i % 2 === 0 ? 'Invitado' : 'Entrega'),
    duracion: '1h 00m'
  }))
];

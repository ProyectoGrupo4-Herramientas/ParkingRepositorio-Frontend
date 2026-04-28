import { format, subDays } from 'date-fns';

const today = new Date();
const strToday = format(today, 'yyyy-MM-dd');
const strYesterday = format(subDays(today, 1), 'yyyy-MM-dd');
const strDayBefore = format(subDays(today, 2), 'yyyy-MM-dd');

export const accessData = [
  // Hoy
  { id: 1, fecha: strToday, hora: "08:42 AM", placa: "ABC-1234", unidad: "Unit 402", residente: "Sarah Jenkins", vehiculo: "Tesla Model 3", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 2, fecha: strToday, hora: "08:35 AM", placa: "XYZ-9876", unidad: "Unit 115", residente: "Michael Chang", vehiculo: "Ford F-150", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 3, fecha: strToday, hora: "08:29 AM", placa: "ILEGIBLE", unidad: "--", residente: "Desconocido", vehiculo: "Desconocido", tipo: "Alerta", estado: "Pendiente Manual", duracion: "--" },
  { id: 4, fecha: strToday, hora: "12:15 PM", placa: "DEF-5678", unidad: "Unit 201", residente: "Invitado", vehiculo: "Honda Civic", tipo: "Invitado", estado: "Salida Registrada", duracion: "02:15" },
  { id: 5, fecha: strToday, hora: "12:02 PM", placa: "LMN-4321", unidad: "Unit 610", residente: "David Park", vehiculo: "Polestar 2", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 6, fecha: strToday, hora: "12:55 PM", placa: "GHI-3456", unidad: "Unit 305", residente: "Emma Wilson", vehiculo: "Toyota RAV4", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 7, fecha: strToday, hora: "07:40 AM", placa: "JKL-7890", unidad: "Unit 802", residente: "James Smith", vehiculo: "BMW 3 Series", tipo: "Residente", estado: "Salida Registrada", duracion: "14:30" },
  { id: 8, fecha: strToday, hora: "07:30 AM", placa: "MNO-1122", unidad: "--", residente: "Amazon", vehiculo: "Ford Transit", tipo: "Entrega", estado: "Entrada Aprobada", duracion: "--" },
  { id: 9, fecha: strToday, hora: "02:15 PM", placa: "PQR-3344", unidad: "Unit 512", residente: "Olivia Davis", vehiculo: "Audi Q5", tipo: "Residente", estado: "Salida Registrada", duracion: "08:45" },
  { id: 10, fecha: strToday, hora: "02:05 PM", placa: "STU-5566", unidad: "Unit 102", residente: "William Taylor", vehiculo: "Mercedes C-Class", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 11, fecha: strToday, hora: "06:50 AM", placa: "VWX-7788", unidad: "--", residente: "FedEx", vehiculo: "GMC Savana", tipo: "Entrega", estado: "Salida Registrada", duracion: "00:20" },
  { id: 12, fecha: strToday, hora: "06:45 AM", placa: "YZA-9900", unidad: "Unit 905", residente: "Sophia Moore", vehiculo: "Lexus RX", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 18, fecha: strToday, hora: "09:30 AM", placa: "BBA-1122", unidad: "Unit 205", residente: "Carlos Ruiz", vehiculo: "Kia Rio", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 19, fecha: strToday, hora: "09:45 AM", placa: "CCA-3344", unidad: "--", residente: "DHL", vehiculo: "Renault Master", tipo: "Entrega", estado: "Salida Registrada", duracion: "00:15" },
  { id: 20, fecha: strToday, hora: "10:10 AM", placa: "DDA-5566", unidad: "Unit 412", residente: "Invitado", vehiculo: "Nissan Versa", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" },
  { id: 21, fecha: strToday, hora: "10:30 AM", placa: "EEA-7788", unidad: "Unit 308", residente: "Ana Lopez", vehiculo: "Hyundai Elantra", tipo: "Residente", estado: "Salida Registrada", duracion: "12:00" },
  { id: 22, fecha: strToday, hora: "11:05 AM", placa: "FFA-9900", unidad: "--", residente: "Uber Eats", vehiculo: "Moto Honda", tipo: "Entrega", estado: "Entrada Aprobada", duracion: "--" },
  { id: 23, fecha: strToday, hora: "01:20 PM", placa: "GGA-1234", unidad: "Unit 505", residente: "Invitado", vehiculo: "Toyota Yaris", tipo: "Invitado", estado: "Salida Registrada", duracion: "03:10" },
  { id: 24, fecha: strToday, hora: "03:45 PM", placa: "HHA-5678", unidad: "Unit 710", residente: "Pedro Gomez", vehiculo: "Mazda 3", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 25, fecha: strToday, hora: "04:30 PM", placa: "IIA-9012", unidad: "Unit 805", residente: "Invitado", vehiculo: "Chevrolet Spark", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" },

  // Ayer
  { id: 13, fecha: strYesterday, hora: "11:30 PM", placa: "BCD-2233", unidad: "Unit 410", residente: "Liam Martin", vehiculo: "Kia Sportage", tipo: "Residente", estado: "Salida Registrada", duracion: "04:10" },
  { id: 14, fecha: strYesterday, hora: "11:15 PM", placa: "EFG-4455", unidad: "Unit 708", residente: "Isabella Garcia", vehiculo: "Hyundai Tucson", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 15, fecha: strYesterday, hora: "10:50 PM", placa: "HIJ-6677", unidad: "Unit 220", residente: "Lucas Rodriguez", vehiculo: "Chevrolet Silverado", tipo: "Residente", estado: "Salida Registrada", duracion: "06:25" },
  { id: 16, fecha: strYesterday, hora: "10:30 PM", placa: "KLM-8899", unidad: "--", residente: "Uber", vehiculo: "Toyota Camry", tipo: "Invitado", estado: "Salida Registrada", duracion: "00:05" },
  { id: 17, fecha: strYesterday, hora: "09:45 PM", placa: "NOP-0011", unidad: "Unit 315", residente: "Mia Martinez", vehiculo: "Nissan Altima", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 26, fecha: strYesterday, hora: "08:15 AM", placa: "JJA-3456", unidad: "Unit 105", residente: "Luis Fernandez", vehiculo: "Ford Explorer", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 27, fecha: strYesterday, hora: "08:45 AM", placa: "KKA-7890", unidad: "--", residente: "Amazon", vehiculo: "Ram 1500", tipo: "Entrega", estado: "Salida Registrada", duracion: "00:25" },
  { id: 28, fecha: strYesterday, hora: "09:20 AM", placa: "LLA-1122", unidad: "Unit 210", residente: "Invitado", vehiculo: "Honda CR-V", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" },
  { id: 29, fecha: strYesterday, hora: "12:30 PM", placa: "MMA-3344", unidad: "Unit 312", residente: "Elena Sanchez", vehiculo: "Volkswagen Jetta", tipo: "Residente", estado: "Salida Registrada", duracion: "08:15" },
  { id: 30, fecha: strYesterday, hora: "02:45 PM", placa: "NNA-5566", unidad: "Unit 508", residente: "Invitado", vehiculo: "Subaru Outback", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" },

  // Hace 2 días
  { id: 31, fecha: strDayBefore, hora: "07:10 AM", placa: "OOA-7788", unidad: "Unit 602", residente: "Roberto Diaz", vehiculo: "Jeep Grand Cherokee", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 32, fecha: strDayBefore, hora: "07:55 AM", placa: "PPA-9900", unidad: "--", residente: "FedEx", vehiculo: "GMC Sierra", tipo: "Entrega", estado: "Salida Registrada", duracion: "00:18" },
  { id: 33, fecha: strDayBefore, hora: "08:30 AM", placa: "QQA-1234", unidad: "Unit 705", residente: "Invitado", vehiculo: "Audi A4", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" },
  { id: 34, fecha: strDayBefore, hora: "11:15 AM", placa: "RRA-5678", unidad: "Unit 812", residente: "Carmen Vega", vehiculo: "BMW X5", tipo: "Residente", estado: "Salida Registrada", duracion: "10:30" },
  { id: 35, fecha: strDayBefore, hora: "01:40 PM", placa: "SSA-9012", unidad: "Unit 110", residente: "Invitado", vehiculo: "Mercedes-Benz GLE", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" },
  { id: 36, fecha: strDayBefore, hora: "04:25 PM", placa: "TTA-3456", unidad: "Unit 208", residente: "Jorge Morales", vehiculo: "Lexus NX", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 37, fecha: strDayBefore, hora: "05:50 PM", placa: "UUA-7890", unidad: "--", residente: "Desconocido", vehiculo: "Desconocido", tipo: "Alerta", estado: "Pendiente Manual", duracion: "--" },
  { id: 38, fecha: strDayBefore, hora: "06:15 PM", placa: "VVA-1122", unidad: "Unit 302", residente: "Invitado", vehiculo: "Porsche Macan", tipo: "Invitado", estado: "Salida Registrada", duracion: "04:45" },
  { id: 39, fecha: strDayBefore, hora: "07:30 PM", placa: "WWA-3344", unidad: "Unit 405", residente: "Marta Flores", vehiculo: "Volvo XC90", tipo: "Residente", estado: "Entrada Aprobada", duracion: "--" },
  { id: 40, fecha: strDayBefore, hora: "08:45 PM", placa: "XXA-5566", unidad: "Unit 510", residente: "Invitado", vehiculo: "Land Rover Defender", tipo: "Invitado", estado: "Entrada Aprobada", duracion: "--" }
];

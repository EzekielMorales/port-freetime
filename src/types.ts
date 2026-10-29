export interface PassengerData {
  name: string;
  role: string;
  flight: string;
  date: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  gate: string;
  boardingTime: string;
  seat: string;
  seatType: string;
  cabinClass: string;
  classType: string;
  seq: string;
}

export const DEFAULT_PASSENGER: PassengerData = {
  name: 'S. MEEDECHA',
  role: 'SOFTWARE DEVELOPMENT ENGINEER IN TEST',
  flight: 'TD1887',
  date: '2 AUG 2026',
  originCode: 'MAN',
  originCity: 'MANCHESTER, UK',
  destCode: 'REM',
  destCity: 'REMOTE, GLOBAL',
  gate: 'A12',
  boardingTime: '08:45',
  seat: '18A',
  seatType: 'WINDOW',
  cabinClass: 'J',
  classType: 'BUSINESS',
  seq: '0029',
};

// src/types/moment-jalaali.d.ts
declare module 'moment-jalaali' {
  import moment from 'moment';
  
  interface MomentJalaali extends moment.Moment {
    format(format: string): string;
  }
  
  function momentJalaali(date?: any): MomentJalaali;
  
  export = momentJalaali;
}
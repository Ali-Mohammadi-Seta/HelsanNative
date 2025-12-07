export const timeConventor = ({
    date,
    time,
  }: {
    date: string;
    time: string;
  }): string => {
    const newTime = date.split('T')[0] + 'T' + time + ':00';
    return newTime;
  };
  
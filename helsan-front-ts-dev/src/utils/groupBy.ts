export const groupBy = <T, K extends keyof T>(
    collection: T[],
    property: K
  ): T[][] => {
    const values: T[K][] = [];
    const result: T[][] = [];
  
    for (let i = 0; i < collection.length; i++) {
      const val = collection[i][property];
      const index = values.indexOf(val);
      if (index > -1) {
        result[index].push(collection[i]);
      } else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  };
  
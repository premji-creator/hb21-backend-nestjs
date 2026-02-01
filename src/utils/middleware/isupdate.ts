/**
 * Compares specific keys between two objects.
 * Returns an object containing only the changed fields for 'old' and 'new'.
 */
// export function getChangedFields<T>(oldData: T, newData: any, keys: (keyof T)[]): { hasChanged: boolean, oldValues: any, newValues: any } {
//   const oldValues: any = {};
//   const newValues: any = {};
//   let hasChanged = false;

//   for (const key of keys) {
//     // Basic normalization: handle string vs number for decimals/dates
//     const oldVal = oldData[key]?.toString();
//     const newVal = newData[key]?.toString();

//     if (oldVal !== newVal) {
//       oldValues[key as string] = oldData[key];
//       newValues[key as string] = newData[key];
//       hasChanged = true;
//     }
//   }

//   return { hasChanged, oldValues, newValues };
// }


export function getChangedFields<T>(oldData: T, newData: any, keys: (keyof T)[]): { hasChanged: boolean, oldValues: any, newValues: any } {
  const oldValues: any = {};
  const newValues: any = {};
  let hasChanged = false;

  for (const key of keys) {
    const oldVal = oldData[key];
    const newVal = newData[key];

    // Check if we are dealing with a numeric/decimal field
    const isNumeric = !isNaN(parseFloat(oldVal as any)) || !isNaN(parseFloat(newVal as any));

    if (isNumeric && oldVal !== null && newVal !== null) {
      const parsedOld = parseFloat(oldVal as any);
      const parsedNew = parseFloat(newVal as any);

      if (parsedOld !== parsedNew) {
        // Store both as formatted strings (e.g., "260.00")
        oldValues[key as string] = parsedOld.toFixed(2);
        newValues[key as string] = parsedNew.toFixed(2);
        hasChanged = true;
      }
      continue;
    }

    // Standard comparison for non-numeric fields (e.g., "Debit" vs "Credit")
    if (oldVal?.toString() !== newVal?.toString()) {
      oldValues[key as string] = oldVal;
      newValues[key as string] = newVal;
      hasChanged = true;
    }
  }

  return { hasChanged, oldValues, newValues };
}
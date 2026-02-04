export function pickAuditSnapshot<T extends Record<string, any>>(entity: T, fields: readonly (keyof T)[]) {
  const result: Partial<T> = {};

  fields.forEach((field) => {
    if (entity[field] !== undefined) {
      result[field] = entity[field];
    }
  });

  return result;
}

export function buildAuditDiff<T extends Record<string, any>>(
  oldEntity: T,
  newEntity: T,
  fields: readonly (keyof T)[],
) {
  const oldData: Partial<T> = {};
  const newData: Partial<T> = {};

  fields.forEach((field) => {
    if (oldEntity[field] !== newEntity[field]) {
      oldData[field] = oldEntity[field];
      newData[field] = newEntity[field];
    }
  });

  return {
    oldData: Object.keys(oldData).length ? oldData : undefined,
    newData: Object.keys(newData).length ? newData : undefined,
  };
}

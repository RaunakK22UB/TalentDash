export function serializeData(val: any): any {
  if (val === null || val === undefined) {
    return val;
  }

  if (typeof val === 'bigint') {
    if (val > BigInt(Number.MAX_SAFE_INTEGER) || val < BigInt(Number.MIN_SAFE_INTEGER)) {
      return val.toString();
    }
    return Number(val);
  }

  if (typeof val === 'object') {
    // Check for Decimal objects (from Prisma/decimal.js)
    if ('toNumber' in val && typeof val.toNumber === 'function') {
      return val.toNumber();
    }

    if (val instanceof Date) {
      return val.toISOString();
    }

    if (Array.isArray(val)) {
      return val.map(serializeData);
    }

    const serialized: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      serialized[key] = serializeData(val[key]);
    }
    return serialized;
  }

  return val;
}

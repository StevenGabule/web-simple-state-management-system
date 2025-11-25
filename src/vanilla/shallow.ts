const isIterable = (obj: object): obj is Iterable<unknown> =>
  Symbol.iterator in obj;

const hasIterableEntries = (
  value: Iterable<unknown>
): value is Iterable<unknown> & {
  entries(): Iterable<[unknown, unknown]>;
} => "entries" in value;

const compareEntries = (
  valueA: { entries(): Iterable<[unknown, unknown]> },
  valueB: { entries(): Iterable<[unknown, unknown]> }
) => {
  const mapA = valueA instanceof Map ? valueA : new Map(valueA.entries());
  const mapB = valueB instanceof Map ? valueB : new Map(valueB.entries());

  if (mapA.size !== mapB.size) {
    return false;
  }

  for (const [key, value] of mapA) {
    if (!mapB.has(key) || !Object.is(value, mapB.get(key))) {
      return false;
    }
  }

  return true;
};

// Ordered iterables
const compareIterables = (
  valueA: Iterable<unknown>,
  valueB: Iterable<unknown>
) => {
  const iterableA = valueA[Symbol.iterator]();
  const iterableB = valueB[Symbol.iterator]();

  let nextA = iterableA.next();
  let nextB = iterableB.next();

  while (!nextA.done && !nextB.done) {
    if (!Object.is(nextA.value, nextB.value)) {
      return false;
    }

    nextA = iterableA.next();
    nextB = iterableB.next();
  }

  return !!nextA.done || !!nextB.done;
};

export function shallow<T>(valueA: T, valueB: T): boolean {
  if (Object.is(valueA, valueB)) {
    return true;
  }

  if (
    typeof valueA !== "object" ||
    valueA === null ||
    typeof valueB !== "object" ||
    valueB === null
  ) {
    return false;
  }

  if (Object.getPrototypeOf(valueA) !== Object.getPrototypeOf(valueB)) {
    return false;
  }

  if (isIterable(valueA) && isIterable(valueB)) {
    if (hasIterableEntries(valueA) && hasIterableEntries(valueB)) {
      return compareEntries(valueA, valueB);
    }

    return compareIterables(valueA, valueB);
  }

  return compareEntries(
    { entries: () => Object.entries(valueA) },
    { entries: () => Object.entries(valueB) }
  );
}

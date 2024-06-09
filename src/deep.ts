/**
 * Get or set a value in an object using a path. This will mutate the object
 * passed in when setting a value.
 *
 * @param obj - The object to set a value in.
 * @param path - The path to the value.
 * @param val - The value to set.
 * @returns The updated object.
 */
export default function deep<T = unknown>(
  /* biome-ignore lint/suspicious/noExplicitAny: */
  obj: Record<string, any>,
  path: string,
  /* biome-ignore lint/suspicious/noExplicitAny: */
  val?: any
): T {
  const keys = path.replaceAll("[", ".[").split(".");

  for (let i = 0; i < keys.length; i++) {
    let currentKey: string | number = keys[i];

    if (currentKey.includes("[")) {
      currentKey = Number.parseInt(
        currentKey.substring(1, currentKey.length - 1)
      );
    }

    if (typeof val !== "undefined") {
      let nextKey: string | number = keys[i + 1];

      if (nextKey?.includes("[")) {
        nextKey = Number.parseInt(nextKey.substring(1, nextKey.length - 1));
      }

      if (typeof nextKey !== "undefined") {
        obj[currentKey] = obj[currentKey]
          ? obj[currentKey]
          /* biome-ignore lint/suspicious/noGlobalIsNan: */
          : isNaN(nextKey as number)
          ? {}
          : [];
      } else {
        obj[currentKey] = val;
      }
    }

    /* biome-ignore lint/style/noParameterAssign: */
    obj = obj[currentKey];
  }

  return obj as T;
}

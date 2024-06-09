import { type createForm, deep } from "./index";

/**
 * An object definition of handling for key output of reForm.
 */
export type ReFormKeyMapObject = {
  /**
   * The path to the key value.
   */
  path?: string;
  /**
   * Transform a key to a different key.
   *
   * @param key - The key to transform.
   * @returns The transformed key.
   */
  transform?: (
    value: string,
    context: {
      key: string;
      path: string;
      state: ReturnType<typeof createForm>["state"];
      input: ReturnType<typeof createForm>["input"];
    }
  ) => string;
};

/**
 * A mapping for key output of reForm.
 */
export type ReFormKeyMap = Partial<{
  [key: keyof ReturnType<typeof createForm>["state"]]:
    | string // an explicit path override
    | ReFormKeyMapObject
    | undefined;
}>;

/**
 * Reformat a form with paths and transforms or explicit reassignments.
 *
 * @param createFormReturn - The return value of the createForm function.
 * @param reformDefaults - The default values for the reform.
 * @param reformKeyMap - The key map for the reform.
 * @returns The return value of the createForm function with a `finalize`
 * method.
 *
 * @example
 *
 * ```ts
 * import { createForm, nameReForm } from "@tarcltd/form";
 *
 * const { state, finalize } = reForm(
 *   createForm({
 *     type: "object",
 *     properties: {
 *       "main:name": {
 *         type: "string",
 *         name: "Name",
 *       },
 *       "another:email": {
 *         type: "string",
 *         name: "Email",
 *         format: "email",
 *       },
 *       "another:favcolor": {
 *         type: "string",
 *         name: "Favorite Color",
 *       },
 *     },
 *     required: ["main:name", "another:email", "another:favcolor"],
 *   })
 * );
 *
 * state["main:name"] = "John Doe";
 * state["another:email"] = "john@doe.com";
 * state["another:favcolor"] = "deep purple";
 *
 * console.log(finalize({
 *   path: "name",
 *   transform: (value) => value.toUpperCase(),
 * }));
 * // {
 * //   NAME: "John Doe",
 * //   EMAIL: "john@doe.com",
 * //   "FAVORITE COLOR": "deep purple",
 * // }
 *
 * console.log(finalize({
 *   transform: (_, { key }) => `${key.split(':')[1]}[0]`,
 * }, {
 *   "main:name": "info.name",
 *   "another:email": "info.email",
 * }));
 * // {
 * //   info: {
 * //     name: "John Doe",
 * //     email: "john@doe.com",
 * //   },
 * //   favcolor: ["deep purple"],
 * // }
 * ```
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export function reForm<T = Record<string, any>>(
  createFormReturn: ReturnType<typeof createForm<T>>,
  reformDefaults: ReFormKeyMapObject = {},
  reformKeyMap: ReFormKeyMap = {}
): ReturnType<typeof createForm<T>> & {
  finalize: (
    defaults?: ReFormKeyMapObject,
    keyMap?: ReFormKeyMap
    /* biome-ignore lint/suspicious/noExplicitAny: */
  ) => Record<string, any>;
} {
  return {
    ...createFormReturn,
    finalize(
      defaults: ReFormKeyMapObject = reformDefaults,
      keyMap: ReFormKeyMap = reformKeyMap
    ) {
      /* biome-ignore lint/suspicious/noExplicitAny: */
      const _transForm: Record<string, any> = {};

      for (const key in createFormReturn.state) {
        const keyPath = keyMap[key];

        if (typeof keyPath === "string") {
          deep(_transForm, keyPath, createFormReturn.state[key]);
        } else if (
          typeof keyPath === "object" &&
          typeof keyPath.path === "string" &&
          typeof keyPath.transform === "function"
        ) {
          deep(
            _transForm,
            keyPath.transform(
              deep(createFormReturn.input.properties[key], keyPath.path),
              {
                key,
                path: keyPath.path,
                state: createFormReturn.state,
                input: createFormReturn.input,
              }
            ),
            createFormReturn.state[key]
          );
        } else if (
          typeof keyPath === "object" &&
          typeof keyPath.path === "string"
        ) {
          if (typeof defaults?.transform === "function") {
            deep(
              _transForm,
              defaults.transform(
                deep(createFormReturn.input.properties[key], keyPath.path),
                {
                  key,
                  path: keyPath.path,
                  state: createFormReturn.state,
                  input: createFormReturn.input,
                }
              ),
              createFormReturn.state[key]
            );
          } else {
            deep(
              _transForm,
              deep(createFormReturn.input.properties[key], keyPath.path),
              createFormReturn.state[key]
            );
          }
        } else if (
          typeof keyPath === "object" &&
          typeof keyPath.transform === "function"
        ) {
          if (typeof defaults?.path === "string") {
            deep(
              _transForm,
              keyPath.transform(
                deep(createFormReturn.input.properties[key], defaults?.path),
                {
                  key,
                  path: defaults?.path,
                  state: createFormReturn.state,
                  input: createFormReturn.input,
                }
              ),
              createFormReturn.state[key]
            );
          } else {
            deep(
              _transForm,
              keyPath.transform(key, {
                key,
                path: key,
                state: createFormReturn.state,
                input: createFormReturn.input,
              }),
              createFormReturn.state[key]
            );
          }
        } else if (typeof keyPath === "undefined") {
          if (typeof defaults?.path === "string") {
            if (typeof defaults?.transform === "function") {
              deep(
                _transForm,
                defaults.transform(
                  deep(createFormReturn.input.properties[key], defaults.path),
                  {
                    key,
                    path: defaults.path,
                    state: createFormReturn.state,
                    input: createFormReturn.input,
                  }
                ),
                createFormReturn.state[key]
              );
            } else {
              deep(
                _transForm,
                deep(createFormReturn.input.properties[key], defaults.path),
                createFormReturn.state[key]
              );
            }
          } else {
            if (typeof defaults?.transform === "function") {
              deep(
                _transForm,
                defaults.transform(key, {
                  key,
                  path: key,
                  state: createFormReturn.state,
                  input: createFormReturn.input,
                }),
                createFormReturn.state[key]
              );
            } else {
              deep(_transForm, key, createFormReturn.state[key]);
            }
          }
        }
      }

      return _transForm;
    },
  };
}

/**
 * Reformat a form using field names in snake case as keys.
 *
 * @param createFormReturn - The return value of the createForm function.
 * @returns The return value of the createForm function with a `finalize`
 * method.
 *
 * @example
 *
 * ```ts
 * import { createForm, nameReForm } from "@tarcltd/form";
 *
 * const { state, finalize } = nameReForm(
 *   createForm({
 *     type: "object",
 *     properties: {
 *       "main:name": {
 *         type: "string",
 *         name: "Name",
 *       },
 *       "another:email": {
 *         type: "string",
 *         name: "Email",
 *         format: "email",
 *       },
 *       "another:favcolor": {
 *         type: "string",
 *         name: "Favorite Color",
 *       },
 *     },
 *     required: ["main:name", "another:email", "another:favcolor"],
 *   })
 * );
 *
 * state["main:name"] = "John Doe";
 * state["another:email"] = "john@doe.com";
 * state["another:favcolor"] = "deep purple";
 *
 * console.log(finalize());
 * // {
 * //   name: "John Doe",
 * //   email: "john@doe.com",
 * //   favorite_color: "deep purple",
 * // }
 * ```
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export function nameReForm<T = Record<string, any>>(
  createFormReturn: ReturnType<typeof createForm<T>>
): ReturnType<typeof reForm<T>> {
  return reForm(createFormReturn, {
    path: "name",
    transform: (value) => value.replace(/\s+/g, "_").toLowerCase(),
  });
}

/**
 * Reformat a form using groups as parent objects.
 *
 * @param createFormReturn - The return value of the createForm function.
 * @returns The return value of the createForm function with a `finalize`
 * method.
 *
 * @example
 *
 * ```ts
 * import { createForm, groupReForm } from "@tarcltd/form";
 *
 * const { state, finalize } = groupReForm(
 *   createForm({
 *     type: "object",
 *     properties: {
 *       "main:name": {
 *         type: "string",
 *         name: "Name",
 *       },
 *       "another:email": {
 *         type: "string",
 *         name: "Email",
 *         format: "email",
 *       },
 *       "another:favcolor": {
 *         type: "string",
 *         name: "Favorite Color",
 *       },
 *     },
 *     required: ["main:name", "another:email", "another:favcolor"],
 *   })
 * );
 *
 * state["main:name"] = "John Doe";
 * state["another:email"] = "john@doe.com";
 * state["another:favcolor"] = "deep purple";
 *
 * console.log(finalize());
 * // {
 * //   main: {
 * //     name: "John Doe",
 * //   },
 * //   another: {
 * //     email: "john@doe.com",
 * //     favcolor: "deep purple",
 * //   },
 * // }
 * ```
 */
/* biome-ignore lint/suspicious/noExplicitAny: */
export function groupReForm<T = Record<string, any>>(
  createFormReturn: ReturnType<typeof createForm<T>>
): ReturnType<typeof reForm<T>> {
  return reForm(createFormReturn, {
    transform: (_, { key }) => key.replace(/:/g, ".").replace(/\s+/g, "_"),
  });
}

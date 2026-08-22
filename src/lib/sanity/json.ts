/** Serializable JSON value — the transport shape of a Sanity query result. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

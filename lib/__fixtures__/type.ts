export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes:
        | {
            name: string;
          }[]
        | null;
    }[];
  };
  [key: string]: any;
}

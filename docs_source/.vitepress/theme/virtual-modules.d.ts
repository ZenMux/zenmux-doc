declare module "@localSearchIndex" {
  interface SearchIndexModule {
    default: string;
  }

  const localSearchIndex: Readonly<
    Record<string, () => Promise<SearchIndexModule>>
  >;

  export default localSearchIndex;
}

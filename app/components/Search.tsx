import {
  RefinementList,
  SearchBox,
  Hits,
  Configure,
  Highlight,
  Pagination,
  InstantSearch
} from "react-instantsearch-dom";

const HitComponent = ({ hit }) => {
  return (
    <div>
      <p>{JSON.stringify(hit)}</p>
    </div>
  );
};

export default function Search({
  searchClient,
  resultsState,
  onSearchStateChange,
  searchState,
  createURL,
  indexName,
  onSearchParameters,
  ...rest
}) {

  return (
    <InstantSearch
      searchClient={searchClient}
      resultsState={resultsState}
      onSearchStateChange={onSearchStateChange}
      searchState={searchState}
      createURL={createURL}
      indexName={indexName}
      onSearchParameters={onSearchParameters}
      {...rest}
    >
      <Configure hitsPerPage={12} />
      <header>
        <h1>React InstantSearch + Next.Js</h1>
        <SearchBox />
      </header>
      <main>
        <div className="menu">
          <RefinementList attribute="categories" />
        </div>
        <div className="results">
          <Hits hitComponent={HitComponent} />
        </div>
      </main>
      <footer>
        <Pagination />
        <div>
          See{" "}
          <a href="https://github.com/algolia/react-instantsearch/tree/master/examples/next">
            source code
          </a>{" "}
          on github
        </div>
      </footer>
    </InstantSearch>
  );
}

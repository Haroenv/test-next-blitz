import React, { useState } from "react"
import Layout from "app/core/layouts/Layout"
import { GetServerSideProps, useRouter } from "blitz"
import algoliasearch from "algoliasearch/lite"
import { findResultsState } from "react-instantsearch-dom/server"
import qs from "qs"
import Search from "app/components/Search"
import { useDebouncedCallback } from "use-debounce"

const pathToSearchState = (path) =>
  path.includes("?") ? qs.parse(path.substring(path.indexOf("?") + 1)) : {}

const createURL = (state) => `?${qs.stringify(state)}`

const searchStateToURL = (searchState, path) =>
  searchState ? `${path}?${qs.stringify(searchState)}` : ""

const searchClient = algoliasearch("latency", "6be0576ff61c053d5f9a3225e2a90f76")

const indexName = "instant_search"

const SearchPage = ({ indexName, searchState, resultsState }) => {
  const router = useRouter()

  const path = router.asPath
  const [searchQuery, setSearchQuery] = useState(searchState)

  const debouncedSetSearch = useDebouncedCallback((searchState) => {
    const href = searchStateToURL(searchState, path)
    router.push(href)
    setSearchQuery(searchState)
  }, 300)

  const title = "Search"

  return (
    <Layout title={`My App | ${title}`}>
      <Search
        searchClient={searchClient}
        indexName={indexName}
        searchState={searchQuery}
        onSearchStateChange={debouncedSetSearch.callback}
        createURL={createURL}
        resultsState={resultsState}
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl }) => {
  const searchState = pathToSearchState(resolvedUrl)

  const resultsState = await findResultsState(Search, {
    searchClient,
    indexName,
    searchState,
  })

  return {
    props: {
      resultsState: {
        ...resultsState,
        metadata: dehydrateMetadata(resultsState),
        state: dehydrateState(resultsState),
      },
      searchState,
      indexName,
    },
  }
}

function dehydrateMetadata(resultsState) {
  if (!resultsState) {
    return []
  }

  // add a value noop, which gets replaced once the widgets are mounted
  return resultsState.metadata.map((datum) => ({
    ...datum,
    value: undefined,
    items:
      datum.items &&
      datum.items.map((item) => ({
        ...item,
        value: undefined,
        items:
          item.items &&
          item.items.map((nestedItem) => ({
            ...nestedItem,
            value: undefined,
          })),
      })),
  }))
}

function dehydrateState(resultsState) {
  if (!resultsState) {
    return {}
  }

  return JSON.parse(JSON.stringify(resultsState.state))
}

export default SearchPage

import React, {Component} from 'react';
import axios from 'axios';

import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PARAM_PAGE,
  PARAM_HPP,
  PARAM_SEARCH,
  PATH_BASE,
  PATH_SEARCH,
} from "../constants";
import Search from "./Search";
import Table from "./Table";
import Button from './Button';
import Loader from "./Loader";

require('./App.css');

/**
 *    Higher Order Function
 *
 *    concats oldHits (the previously cached pages for this searchKey)
 *    with hits (the hits response from a requested page on the server)
 *    stores in cache (results[searchKey]) all the hits computed
 *    and sets isLoading to false
 *
 *    @param hits {list} the hits list
 *    @param page {number} the page number
 */

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedHits = [
    ...oldHits,
    ...hits
  ];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

/**
 * Higher Order Component
 * which displays the Component passed as param(error taken out)
 * or the error message depending on the error state
 * @param Component the component to render if error is null
 * @returns {function({error: *, [p: string]: *}): *} The component to render
 */

const withError = (Component) => ({error, ...rest}) =>
  error
    ? <div className="interactions">
      <p>Something went wrong...</p>
    </div>
    : <Component {...rest} />;

const TableWithError = withError(Table);

/**
 * Higher Order Component
 * which displays the Component passed as param(isLoading taken out)
 * or the Loader Component depending on the isLoading state
 * @param Component the component to render if isLoading is false
 * @returns {function({error: *, [p: string]: *}): *} The component to render
 */

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loader>Loading...</Loader>
    : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);


class App extends Component {

  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    /**
     *    Binding this to the App Class
     */

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm)
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   *      Updates the hits and and the page
   * @param result
   */

  setSearchTopStories(result) {
    const { hits, page } = result;
    console.log(hits);
    console.log(page);
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  /**
   * Makes a request to the Hacker News API with axios and sets isLoading to true in state during the fetching
   *
   * if success, passes result.data to setSearchTopStories to set state appropriately
   * if failure, sets error object in state
   *
   * @param searchTerm {string} the searched term, by default 'redux' (DEFAULT_QUERY constant)
   * @param page {number} the pageNumber, by default 0
   */

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true }, () => {
      axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this._isMounted && this.setSearchTopStories(result.data))
        .catch(error => this._isMounted && this.setState({ error }));
    });
  };

  // Table Functions

  /**
   * Updates the hits list from state by removing the provided id
   *
   * @param id : {objectID} to filter from the hits list in state
   */

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const { results, searchKey } = this.state;
    const { hits, page } = results[searchKey];
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits : updatedHits, page}
      }
    });
  };


  // Search Functions

  /**
   * Update the searchTerm in state from event.target.value
   * @param event {event} the event of the input
   */

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  };

  /**
   * Update the searchKey in state from the searchTerm provided in the search input,
   * then checks if a search is needed (needsToSearchTopStories()),
   * if needed, makes a new request to the API (fetchSearchTopStories()),
   * finally, prevents the browser from reloading
   *
   * @param event {event} the browser window, to prevent from reloading
   */

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  /**
   * Checks if the requested search has already been stored in cache (results[searchTerm])
   * @param searchTerm {string} the search term, also used as key to store previous searches in results
   * @returns {boolean} true if this searched hasn't been stored in cache, otherwise false
   */

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
    } = this.state;

    if (error) { console.error(error) }

    const page = (
      results
      && results[searchKey]
      && results[searchKey].page) || 0;

    const list = (
      results
      && results[searchKey]
      && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            searchTerm={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Rechercher
          </Search>
        </div>
          <TableWithError
            error={error}
            list={list}
            onDismiss={this.onDismiss}
          />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            Plus d'articles
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
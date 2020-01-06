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
} from "../../constants";
import Search from "../Search";
import Table from "../Table";
import Button from '../Button';
import Loader from "../Loader";

require('./index.css');

/**
 *    High Order Function which
 *    concats oldHits (the previously cached pages for this searchKey)
 *    with hits (the hits response from a requested page on the server)
 *    stores in cache (results[searchKey]) all the hits computed
 *    and sets isLoading to false
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
 * High Order Component
 * which displays the Component passed as param(error taken out)
 * or the error message depending on the error state
 * @param Component the component to render is error is null
 * @returns {function({error: *, [p: string]: *}): *}
 */

const withError = (Component) => ({error, ...rest}) =>
  error
    ? <div className="interactions">
      <p>Something went wrong...</p>
    </div>
    : <Component {...rest} />;

const TableWithError = withError(Table);

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

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true }, () => {
      axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this._isMounted && this.setSearchTopStories(result.data))
        .catch(error => this._isMounted && this.setState({ error }));
    });
  };


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

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  };

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
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

  if (error) {
    console.log(error);
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
    } = this.state;

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
            Search
          </Search>
        </div>
          <TableWithError
            error={error}
            onSort={this.onSort}
            list={list}
            onDismiss={this.onDismiss}
          />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
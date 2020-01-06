import React from "react";
import Button from './Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {sortBy} from 'lodash';

require('./Table.css');

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">
      <span className="largeColumn">
        <Sort
          sortKey={'TITLE'}
          onSort={this.onSort}
          activeSortKey={sortKey}
        >
          Titre
        </Sort>
      </span>
          <span className="midColumn">
        <Sort
          sortKey={'AUTHOR'}
          onSort={this.onSort}
          activeSortKey={sortKey}
        >
          Auteur
        </Sort>
      </span>
          <span className="smallColumn">
        <Sort
          sortKey={'COMMENTS'}
          onSort={this.onSort}
          activeSortKey={sortKey}
        >
          Commentaires
        </Sort>
      </span>
          <span className="smallColumn">
        <Sort
          sortKey={'POINTS'}
          onSort={this.onSort}
          activeSortKey={sortKey}
        >
          Points
        </Sort>
      </span>
          <span className="smallColumn">
        Archiver
      </span>
        </div>
        {reverseSortedList.map(item =>
          <div key={item.objectID} className="table-row">
          <span className="largeColumn">
            <a href={item.url}>{item.title}</a>
          </span>
            <span className="midColumn">{item.author}</span>
            <span className="smallColumn">{item.num_comments}</span>
            <span className="smallColumn">{item.points}</span>
            <span className="smallColumn">
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Supprimer
              </Button>
            </span>
          </div>
        )}
      </div>);
  }

};

Table.prototypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      url: PropTypes.string,
      author: PropTypes.string,
      title: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  isSortReverse: PropTypes.bool.isRequired,
};


const Sort = ({sortKey, onSort, children, activeSortKey}) => {
  const sortClass = classNames(
    'button-inline',
    {'button-active': sortKey === activeSortKey}
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
};

import React, {Component} from "react";
import PropTypes from 'prop-types';

class Search extends Component {

  componentDidMount(){
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const {
      searchTerm,
      onChange,
      onSubmit,
      children,
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input
          type={"text"}
          value={searchTerm}
          onChange={onChange}
          ref={el => this.input = el}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

Search.prototypes = {
  searchTerm: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
};

export default Search;
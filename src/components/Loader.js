import React from "react";
import PropTypes from 'prop-types';

const Loader = ({ children }) =>
  <div>
    <i className="fa fa-spinner fa-spin" /> { children }
  </div>;

Loader.defaultProps = {
  children: null,
};

Loader.propTypes = {
  children: PropTypes.node,
};

export default Loader
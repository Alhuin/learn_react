import React from "react";
import PropTypes from 'prop-types';
import Loader from "../Loader";

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type={"button"}
  >
    {children}
  </button>;

Button.defaultProps = {
  classname: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loader>Loading...</Loader>
    : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

export default ButtonWithLoading;
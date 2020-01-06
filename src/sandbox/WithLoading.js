import React from 'react';

export default Component => ({isLoading, ...props}) =>
      isLoading
        ? <div>Loading...</div>
        : <Component {...props}/>;
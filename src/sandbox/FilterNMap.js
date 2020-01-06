import React from 'react';

export const doFilter = filter => input => !filter.split(',').includes(input);

export default class FilterNMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      input: '',
    }
  }

  onFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  render() {
    return (
      <div>
        <ul>
          {
            this.state.input
              .split(',')
              .filter(doFilter(this.state.filter))
              .map((item, index) => item !== '' ? <li key={index}>{item}</li> : null)
          }
        </ul>
        <input type={"text"} placeholder={"filtre,filtre,filtre"} onChange={this.onFilterChange}/>
        <input type={"text"} placeholder={"value,value,value"} onChange={this.onInputChange}/>
      </div>
    );
  }
}
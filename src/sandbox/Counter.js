import React from 'react';

export const doIncrement = state => ({ counter: state.counter + 1 });
export const doDecrement = state => ({ counter: state.counter - 1 });

export default class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
    };
  }

  onIncrement = () => this.setState(doIncrement);
  onDecrement = () => this.setState(doDecrement);

  render() {
    return(
      <>
        <button onClick={this.onIncrement}>Increment</button>
        <p>{this.state.counter}</p>
        <button onClick={this.onDecrement}>Decrement</button>
      </>
    );
  }
}
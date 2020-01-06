import React from 'react';

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.onChange=this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({query: event.target.value});
  }

  render() {

    return (
      <div>
        <ul>
          {
            this.state.query
            .split(',')
            .map((item, index) => {
              console.log('item '+item);
              return item !== '' ? <li key={index}>{item}</li> : null
            })
          }
        </ul>
      <input placeholder={"value,value,val"} type="text" onChange={this.onChange}/>
      </div>
    );
  }
}

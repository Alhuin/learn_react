import React from 'react';

const doFilter = query => user =>
  query === user.name;

export default class Filter extends React.Component {
  /** (A) Si pas de props, on peut zapper le constructeur et déclarer le state en dehors */
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     query: '',
  //   };

  /** (B) Nécessaire que si on utilise une fonction non fléchée, sinon il ne retrouve pas le this constructeur */
    // this.onChange=this.onChange.bind(this);
  // }

  /** (A) */
  state = {
    query: '',
  };

  /** (B) Ca renverrait une erreur si on n'a pas bindé la fonction dans le constructeur : this réfère à la fonction */
  // onChange(event) {
  //   this.setState({query: event.target.value});
  // }

  /** (B) Les fonctions flechées se bindent automatiquement au this constructeur */
  onChange = (event) => {
    this.setState({query: event.target.value});
  };

  render() {

    const users = [
      { name: 'Julien' },
      { name: 'Maceo' },
    ];
    const showUsers = true;

    return (
      <div>
      {
        showUsers && (
          <ul>
            {users
              .filter(doFilter(this.state.query))
              .map((user, index) => <li key={index}>{user.name}</li>)}
          </ul>)
      }
      <input type="text" onChange={this.onChange}/>
      </div>
    );
  }
}

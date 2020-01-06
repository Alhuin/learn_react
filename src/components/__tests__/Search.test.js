import React from "react";
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Search from '../Search';

describe('Search', () => {

  const props = {
    searchTerm: 'test',
    onChange: () => true,
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search { ...props } >Search</Search>, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Search>Search</Search>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

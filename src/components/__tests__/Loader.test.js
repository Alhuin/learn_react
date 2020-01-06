import React from "react";
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Loader from '../Loader';

describe('Loader', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Loader />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Loader>Loading...</Loader>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});



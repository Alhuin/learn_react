import React from "react";
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Button from '../Button';
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe('Button', () => {

  const props = {
    className: 'buttonClass',
    onClick: () => true,
  };

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button { ...props } >Give Me More</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(
      <Button { ...props } >Give Me More</Button>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should have className buttonClass', () => {
    const element = shallow(
      <Button { ...props }>More</Button>
    );
    expect(element.find('.buttonClass').length).toBe(1);
  })
});

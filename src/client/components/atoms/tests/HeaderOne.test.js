import React from 'react'
import {HeaderOne} from '../HeaderOne'
import {shallow} from 'enzyme'

describe('HeaderOne component', () => {
  const component = shallow(<HeaderOne>Hello</HeaderOne>)
  it('should match snapshot', () => {
    expect(component).toMatchSnapshot()
  })
  it('should render children within the h1', () => {
    expect(component.text()).toEqual('Hello')
  })
})

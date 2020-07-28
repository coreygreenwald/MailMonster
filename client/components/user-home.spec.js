import {expect} from 'chai';
import React from 'react';
import enzyme, {shallow, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {UserHome} from './UserHome';

const adapter = new Adapter();
enzyme.configure({adapter});

describe('UserHome', () => {
  let userHome;

  beforeEach(() => {
    userHome = shallow(<UserHome email="corey@email.com" templates={[]}/>);
  });

  it('renders the email in an h3 with no errors even when user has no previous templates', () => {
    const renderText = userHome.find('h3').text();
    expect(renderText.startsWith('Welcome, corey@email.com')).to.be.true;
  });
  
});

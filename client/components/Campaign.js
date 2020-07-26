import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import axios from 'axios';

import TemplatePreview from './TemplatePreview'

class Campaign extends Component {
  constructor(props){
    super(props);
  }

  render(){
    console.log(this.props.templates.activeTemplate)
    return (
      <div>
        <h3>Start an Email Campaign</h3>
        <TemplatePreview template={this.props.templates.activeTemplate} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  templates: state.templates
});

export default connect(mapStateToProps)(Campaign)
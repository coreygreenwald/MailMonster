import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import axios from 'axios';

import TemplatePreview from './TemplatePreview'
import { post } from '../../server/api';

class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      from: 'sdatatester@gmail.com',
      subject: '',
      variables: {},
      previewHtml: ''
    };
  }

  async componentDidMount() {
    this.parseHtmlForVariables(this.props.templates.activeTemplate.html);
    this.setState({
      previewHtml: this.props.templates.activeTemplate.html
    })
  }

  // sendEmail(){
  //   axios.post('/api/mail', {
  //     html: this.state.previewHtml,
  //     to: this.state.to,
  //     from: this.state.from,
  //     subject: this.state.subject,
  //     text: ''
  //   });
  // }

  handleUserVariables = (evt) => {
    const variables = {...this.state.variables};
    variables[evt.target.name] = evt.target.value;
    this.setState({
      variables
    }, () => this.replaceHtmlVariables(this.props.templates.activeTemplate.html));
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  replaceHtmlVariables = (html) => {
    const replacements = Object.keys(this.state.variables).map(val => {
      if(this.state.variables[val]){
        return this.state.variables[val];
      }
      return `{{${val}}}`;
    })
    let updatedHtml = html.replace(/{{\w+}}/gi, () => replacements.shift());
    this.setState({
      previewHtml: updatedHtml
    })
  }

  parseHtmlForVariables = (html) => {
    let variables = html.match(/{{\w+}}/gi);
    if (variables && variables.length) {
      variables = variables
        .map((val) => val.slice(2, -2))
        .reduce((prev, curr) => {
          prev[curr] = this.state.variables[curr] || '';
          return prev;
        }, {});
    }
    this.setState({
      variables
    });
  };

  render() {
    return (
      <div className="campaign-container">
        <h3>Start an Email Campaign</h3>
        <div className="campaign-container-controller">
          <TemplatePreview html={this.state.previewHtml} />
          <div className="campaign-container-controller-inputs">
            <div className="campaign-container-controller-inputs-item">
              <label for="to">To:</label>
              <input
                name="to"
                value={this.state.to}
                onChange={this.handleChange}
              />
            </div>
            <div className="campaign-container-controller-inputs-item">
              <label for="from">From:</label>
              <input
                name="from"
                value={this.state.from}
                onChange={this.handleChange}
                disabled
              />
            </div>
            <div className="campaign-container-controller-inputs-item">
              <label for="subject">Subject:</label>
              <input
                name="subject"
                value={this.state.subject}
                onChange={this.handleChange}
              />
            </div>
            {
              Object.keys(this.state.variables).map((userVariable) => {
                // console.log(idx, userVariable, 'IDX THEN USER VAR')
                return (
                  <div className="campaign-container-controller-inputs-item">
                    <label for={userVariable}>{userVariable}:</label>
                    <input
                      name={userVariable}
                      value={this.state.variables[userVariable]}
                      onChange={this.handleUserVariables}
                    />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  templates: state.templates,
  user: state.user
});

export default connect(mapStateToProps)(Campaign)
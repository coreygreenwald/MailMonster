import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {setActiveTemplate} from '../store';
import TemplatePreview from './TemplatePreview';
import { expect } from 'chai';

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

  initiatePreviewHtml(activeTemplateId){
    const activeTemplate = this.props.templates.items[activeTemplateId];
    this.parseHtmlForVariables(activeTemplate.html);
    this.setState({
      previewHtml: activeTemplate.html,
    });
  }

  async componentDidMount() {
    const activeTemplate = this.props.templates.activeTemplate;
    this.initiatePreviewHtml(activeTemplate)
  }

  async componentDidUpdate(prevProps){
    if(prevProps.templates.activeTemplate !== this.props.templates.activeTemplate){
      const activeTemplate = this.props.templates.activeTemplate;
      this.initiatePreviewHtml(activeTemplate);
    } else if(this.props.templates.activeTemplate === null){
      const activeTemplate = 0; 
      this.initiatePreviewHtml(activeTemplate);
    }
  }

  sendEmail = () => {
    axios.post('/api/mail', {
      html: this.state.previewHtml,
      to: this.state.to,
      from: this.state.from,
      subject: this.state.subject,
      text: ''
    });
  }

  handleUserVariables = (evt) => {
    const variables = {...this.state.variables};
    variables[evt.target.name] = evt.target.value;
    this.setState({
      variables
    }, () => this.replaceHtmlVariables(this.props.templates.items[this.props.templates.activeTemplate].html));
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
    } else {
      variables = {};
    }
    this.setState({
      variables
    });
  };

  render() {
    return (
      <div className="campaign">
        <div className="campaign-render">
          <div className="campaign-controller-input">
            <label htmlFor="active-temp">Active Template:</label>
            <select
              name="active-temp"
              onChange={(evt) => this.props.setActiveTemplate(evt.target.value)}
              className="input"
            >
              {this.props.templates.items.map((item, idx) => (
                <option value={idx}>{item.name}</option>
              ))}
            </select>
          </div>
          <TemplatePreview html={this.state.previewHtml} />
        </div>
        <div className="campaign-controller">
          <div className="campaign-controller-input">
            <label htmlFor="to">To:</label>
            <input
              name="to"
              value={this.state.to}
              onChange={this.handleChange}
            />
          </div>
          <div className="campaign-controller-input">
            <label htmlFor="from">From:</label>
            <input
              name="from"
              value={this.state.from}
              onChange={this.handleChange}
              disabled
            />
          </div>
          <div className="campaign-controller-input">
            <label htmlFor="subject">Subject:</label>
            <input
              name="subject"
              value={this.state.subject}
              onChange={this.handleChange}
            />
          </div>
          <hr />
          {Object.keys(this.state.variables).map((userVariable) => {
            return (
              <div className="campaign-controller-input">
                <label htmlFor={userVariable}>{userVariable}:</label>
                <input
                  name={userVariable}
                  value={this.state.variables[userVariable]}
                  onChange={this.handleUserVariables}
                />
              </div>
            );
          })}
          <button className="btn" onClick={this.sendEmail}>
            Send Email!
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  templates: state.templates,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTemplate(templateId) {
    dispatch(setActiveTemplate(templateId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Campaign)
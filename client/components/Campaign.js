import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {setActiveTemplate, setMessageAndState} from '../store';
import TemplatePreview from './TemplatePreview';
import TemplateSelector from './TemplateSelector';
import FormInput from './FormInput';

class Campaign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: '',
      from: 'sdatatester@gmail.com',
      subject: '',
      variables: {},
      previewHtml: '',
    };
  }

  initiatePreviewHtml(activeTemplateId) {
    const activeTemplate = this.props.templates.items[activeTemplateId];
    this.parseHtmlForVariables(activeTemplate.html);
    this.setState({
      previewHtml: activeTemplate.html,
    });
  }

  async componentDidMount() {
    const activeTemplate = this.props.templates.activeTemplate;
    this.initiatePreviewHtml(activeTemplate);
  }

  async componentDidUpdate(prevProps) {
    if (
      prevProps.templates.activeTemplate !== this.props.templates.activeTemplate
    ) {
      const activeTemplate = this.props.templates.activeTemplate;
      this.initiatePreviewHtml(activeTemplate);
    } else if (this.props.templates.activeTemplate === null) {
      const activeTemplate = 0;
      this.initiatePreviewHtml(activeTemplate);
    }
  }

  validateFields() {
    const {to, from, subject, variables} = this.state;
    const fieldsToComplete = [];
    if (!to) fieldsToComplete.push('to');
    if (!from) fieldsToComplete.push('from');
    if (!subject) fieldsToComplete.push('subject');
    for (let k in variables) {
      if (variables.hasOwnProperty(k) && !variables[k]) {
        //Catch edge case
        fieldsToComplete.push(k.slice(2, -2));
      }
    }
    return fieldsToComplete;
  }

  sendEmail = async () => {
    const {updateToast} = this.props;
    const incompleteFields = this.validateFields();
    if (incompleteFields.length) {
      updateToast(
        `Please fill in the following field(s): ${incompleteFields.join(', ')}`,
        'error'
      );
      return;
    }
    try {
      const {data: emailConfirmation} = await axios.post('/api/mail', {
        html: this.state.previewHtml,
        to: this.state.to,
        from: this.state.from,
        subject: this.state.subject,
        text: '',
      });
      updateToast(`Email to ${this.state.to} sent successfully!`, 'success');
    } catch (err) {
      updateToast(
        `Something went wrong - It's possible you haven't validated this email for sending - use sdatatester@gmail.com for testing!`,
        'error'
      );
    }
  };

  handleUserVariables = (evt) => {
    const variables = {...this.state.variables};
    variables[evt.target.name] = evt.target.value;
    this.setState(
      {
        variables,
      },
      () =>
        this.replaceHtmlVariables(
          this.props.templates.items[this.props.templates.activeTemplate].html
        )
    );
  };

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  replaceHtmlVariables = (html) => {
    const replacements = Object.keys(this.state.variables).map((val) => {
      if (this.state.variables[val]) {
        return this.state.variables[val];
      }
      return `{{${val}}}`;
    });
    let updatedHtml = html.replace(
      /{{\w+}}/gi,
      (item) => this.state.variables[item] || item
    );
    this.setState({
      previewHtml: updatedHtml,
    });
  };

  parseHtmlForVariables = (html) => {
    let variables = html.match(/{{\w+}}/gi);
    if (variables && variables.length) {
      variables = variables.reduce((prev, curr) => {
        prev[curr] = this.state.variables[curr] || '';
        return prev;
      }, {});
    } else {
      variables = {};
    }
    this.setState({
      variables,
    });
  };

  render() {
    return (
      <div className="campaign">
        <div className="campaign-template-select">
          <TemplateSelector />
        </div>
        {this.props.templates.activeTemplate === -1 ? (
          <h2>
            Pick a template to start drafting an email - or head over to{' '}
            <Link to="/templates">templates</Link> to build a new one!
          </h2>
        ) : (
          <div className="campaign-container">
            <div className="campaign-container-render">
              <TemplatePreview html={this.state.previewHtml} size="large" />
            </div>
            <div className="campaign-container-controller">
              <FormInput
                name="to"
                labelDisplay="To"
                value={this.state.to}
                onChangeFunc={this.handleChange}
              />
              <FormInput
                name="from"
                labelDisplay="From"
                value={this.state.from}
                onChangeFunc={this.handleChange}
              />
              <FormInput
                name="subject"
                labelDisplay="Subject"
                value={this.state.subject}
                onChangeFunc={this.handleChange}
              />
              <hr />
              {Object.keys(this.state.variables).map((userVariable) => {
                return (
                  <FormInput
                    name={userVariable}
                    key={userVariable}
                    labelDisplay={userVariable.slice(2, -2)}
                    value={this.state.variables[userVariable]}
                    onChangeFunc={this.handleUserVariables}
                  />
                );
              })}
              <button className="btn" onClick={this.sendEmail}>
                Send Email!
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  templates: state.templates,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTemplate(templateId) {
    dispatch(setActiveTemplate(templateId));
  },
  updateToast(message, state) {
    dispatch(setMessageAndState(message, state));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);

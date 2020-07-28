import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fetchTemplates, updateTemplate, setMessageAndState} from '../store';
import history from '../history';

import EmailEditor from 'react-email-editor';
import TemplateSelector from './TemplateSelector';
import TemplateInstructions from './TemplateInstructions';

const MIN_TEMPLATE_SIZE = 5970;

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      templates: [],
      name: '',
    };
  }

  async componentDidMount() {
    this.props.fetchTemplates();
    if (this.props.templates.activeTemplate !== -1) {
      let activeTemplate = this.props.templates.items[
        this.props.templates.activeTemplate
      ];
      this.loadDesign(activeTemplate.renderData);
      this.setState({
        id: activeTemplate.id,
        name: activeTemplate.name,
      });
    }
  }

  async componentDidUpdate(prevProps) {
    if (
      this.props.templates.activeTemplate !== null &&
      this.props.templates.activeTemplate !== prevProps.templates.activeTemplate
    ) {
      this.loadDesign(
        this.props.templates.items[this.props.templates.activeTemplate]
          .renderData
      );
    }
  }

  handleTransitionToCampaign = () => {
    history.push('/campaigns');
  };

  parseHtmlForVariables = (html) => {
    let userVariables = html.match(/{{\w+}}/gi);
    return userVariables || [];
  };

  exportHtml = () => {
    return new Promise((resolve, reject) => {
      this.editor.exportHtml((data) => {
        const {design, html} = data;
        if (html) resolve(html);
        else reject();
      });
    });
  };

  saveDesign = () => {
    return new Promise((resolve, reject) => {
      this.editor.saveDesign((data) => {
        if (data) resolve(data);
        else reject();
      });
    });
  };

  exportDesign = async () => {
    //Make sure template is named.
    if (!this.state.name) {
      this.props.updateToast('Please name this template!', 'error');
      return;
    }
    const html = await this.exportHtml();
    //Make sure template isn't empty.
    if (html.length < MIN_TEMPLATE_SIZE) {
      this.props.updateToast(
        'Looks like your template is empty - get creative with your design!',
        'error'
      );
      return;
    }
    const data = await this.saveDesign();
    //Determine if this is a new template or a modification to an existing template.
    const id =
      this.props.templates.activeTemplate !== -1
        ? this.props.templates.items[this.props.templates.activeTemplate].id
        : null;
    await this.props.updateTemplate({
      id,
      name: this.state.name,
      html,
      data,
    });
    const userVariables = this.parseHtmlForVariables(html);
    let message = 'Template Saved Successfully!';
    let messageStatus = 'success';
    //Warn user if they made a template that doesn't have available "variables" for them to fill later.
    if (!userVariables.length) {
      message +=
        '\n Warning - There is no personalizable data associated with this template. You can add some to your template by using {{example_here}} wherever you can place text';
      messageStatus = 'warn';
    }
    this.props.updateToast(message, messageStatus);
  };

  loadDesign = async (data) => {
    this.editor.loadDesign(data);
  };

  render() {
    const {items} = this.props.templates;
    return (
      <div className="template">
        <TemplateInstructions />
        <div className="template-editor">
          <div className="template-editor-main">
            <EmailEditor ref={(editor) => (this.editor = editor)} />
          </div>
          <div className="template-editor-controls">
            <div>
              <label className="label-input" htmlFor="template-name">
                Name This Template:{' '}
              </label>
              <input
                name="template-name"
                className="input"
                value={this.state.name}
                onChange={(evt) => this.setState({name: evt.target.value})}
              />
            </div>
            <div>
              <button
                className={this.state.name ? 'btn' : 'btn btn-disabled'}
                onClick={this.exportDesign}
              >
                Save Template
              </button>
              {this.props.templates.activeTemplate !== -1 ? (
                <button
                  className="btn"
                  onClick={this.handleTransitionToCampaign}
                >
                  Use In Campaign
                </button>
              ) : null}
              <TemplateSelector />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  templates: state.templates,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTemplates() {
      dispatch(fetchTemplates());
    },
    updateTemplate(template) {
      dispatch(updateTemplate(template));
    },
    updateToast(message, state) {
      dispatch(setMessageAndState(message, state));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Template);

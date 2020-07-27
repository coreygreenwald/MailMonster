import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {fetchTemplates, updateTemplate} from '../store';
import history from '../history'
import {Link} from 'react-router-dom';
import axios from 'axios';

import EmailEditor from 'react-email-editor';

const MIN_TEMPLATE_SIZE = 5970;

class Template extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: null,
      templates: [],
      message: '',
      messageStatus: 'error', //error / warn / success
      name: ''
    }
  }

  async componentDidMount(){
    this.props.fetchTemplates();
    if(this.props.templates.activeTemplate !== null){
      let activeTemplate = this.props.templates.items[this.props.templates.activeTemplate];
      this.loadDesign(
          activeTemplate.renderData
      );
      this.setState({
        id: activeTemplate.id,
        name: activeTemplate.name
      })
    }
  }

  async componentDidUpdate(prevProps){
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

  render() {
    const { items } = this.props.templates
    return (
      <div className="template">
        <div className="template-instructions">
          <h2>Customize Your Templates</h2>
          <p>
            1. Create an email template using the editor - you can add images,
            text, buttons, and more!
          </p>
          <p>
            2. Specify areas within your template that will be filled with
            personalized information by using the syntax
            {' {{name_of_variable}}'}. You can put these wherever you can write
            text!
          </p>
          <p>
            3. Make sure you like the desktop and mobile views! When you're
            ready give this template a name and click save to save this to your
            account.
          </p>
          <p>
            4. One saved, you can use template now to start a campaign or work
            on some other drafts and head on over to the{' '}
            <Link to="/campaigns">campaigns</Link> page later.
          </p>
        </div>
        <div className="template-editor">
          {this.state.message ? (
            <div className={'alert ' + this.state.messageStatus}>
              <span
                className="closebtn"
                onClick={() => this.setState({message: ''})}
              >
                &times;
              </span>
              {this.state.message}
            </div>
          ) : null}
          {/* <div>
            {Object.keys(this.state.variables).map((val) => (
              <div>
                <h3>{val}</h3>
                <input value={this.state.variables[val]} />
              </div>
            ))}
          </div> */}
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
              {this.props.templates.activeTemplate ? (
                <button
                  className="btn"
                  onClick={this.handleTransitionToCampaign}
                >Use In Campaign</button>
              ) : null}
            </div>
          </div>
        </div>
        {/* {this.props.templates.items.length ? (
            <div>
              {items.map((template) => (
                <div className="template-container-mini">
                  <div>
                    <button
                      onClick={() => this.loadDesign(template.renderData)}
                    >
                      Load Template
                    </button>
                    <button>Send Emails</button>
                  </div>
                  <div
                    className="template-container-mini-border"
                    dangerouslySetInnerHTML={{__html: template.html}}
                  ></div>
                </div>
              ))}
            </div>
          ) : null} */}
      </div>
    );
  }

  handleTransitionToCampaign = () => {
    history.push('/campaigns');
  }

  parseHtmlForVariables = (html) => {
    let userVariables = html.match(/{{\w+}}/ig);
    return userVariables || [];
    // if(variables && variables.length){
    //   variables.map(val => val.slice(2, -2)).reduce((prev, curr) => {
    //     prev[curr] = '';
    //     return prev;
    //   }, {});
    //   this.setState({
    //     variables,
    //   });
    // }
  }

  exportHtml = () => {
    return new Promise((resolve, reject) => {
      this.editor.exportHtml((data) => {
        const {design, html} = data;
        if(html) resolve(html); 
        else reject();
      })
    })
  }

  saveDesign = () => {
    return new Promise((resolve, reject) => {
      this.editor.saveDesign((data) => {
        if(data) resolve(data);
        else reject();
      })
    })
  }
  
  exportDesign = async () => {
    if(!this.state.name){
      this.setState({
        message:  "Please name this template!",
        messageStatus: 'error'
      });
      return;
    }
    const html = await this.exportHtml();
    if (html.length < MIN_TEMPLATE_SIZE) {
      this.setState({
        message: 'Looks like your template is empty - get creative with your design!',
      });
      return;
    }
    const data = await this.saveDesign();
    const id = this.props.templates.activeTemplate !== null ? this.props.templates.items[this.props.templates.activeTemplate].id : null
    await this.props.updateTemplate({
      id,
      name: this.state.name,
      html,
      data
    })
    const userVariables = this.parseHtmlForVariables(html);
    let message = 'Template Saved Successfully!'
    let messageStatus = 'success'
    if(!userVariables.length){
      message += '\n Warning - There is no personalizable data associated with this template. You can add some to your template by using {{example_here}} wherever you can place text';
      messageStatus = 'warn'
    } 
    this.setState({
      message,
      messageStatus
    })
  }

  loadDesign = async (data) => {
    this.editor.loadDesign(data);
  }
}

const mapStateToProps = (state) => ({
  templates: state.templates
})

const mapDispatchToProps = dispatch => {
  return {
    fetchTemplates(){
      dispatch(fetchTemplates());
    },
    updateTemplate(template){
      dispatch(updateTemplate(template))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Template)
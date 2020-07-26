import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {fetchTemplates, updateTemplate} from '../store';
import {Link} from 'react-router-dom';
import axios from 'axios';

import EmailEditor from 'react-email-editor';

class Template extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: null,
      templates: [],
      variables: {}
    }
  }

  async componentDidMount(){
    this.props.fetchTemplates();
  }

  async componentDidUpdate(){
    if(this.props.templates.activeTemplate.hasOwnProperty('data')){
      this.loadDesign(this.props.templates.activeTemplate.data);
    }
  }

  render() {
    const { items } = this.props.templates
    return (
      <div className="template">
        <h1>Template Manager</h1>
        <p>Build your templates here!</p>
        <p>
          Declare variables for your email templates by using{' '}
          {'{{name_of_variable}}'}
        </p>
        <div className="template-container">
          <div>
            <div>
              <button onClick={this.exportDesign}>
                Save Template
              </button>
              {
                this.props.templates.activeTemplate.hasOwnProperty('id') ? (
                  <Link to="/campaigns">Use in Campaign</Link>
                ) : null
              }
              {Object.keys(this.state.variables).map((val) => (
                <div>
                  <h3>{val}</h3>
                  <input value={this.state.variables[val]} />
                </div>
              ))}
            </div>
            <EmailEditor ref={(editor) => (this.editor = editor)} />
          </div>
          {this.props.templates.items.length ? (
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
          ) : null}
        </div>
      </div>
    );
  }

  parseHtmlForVariables = (html) => {
    let variables = html.match(/{{\w+}}/ig);
    if(variables && variables.length){
      variables.map(val => val.slice(2, -2)).reduce((prev, curr) => {
        prev[curr] = '';
        return prev;
      }, {});
      this.setState({
        variables,
      });
    }
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
    const html = await this.exportHtml();
    this.parseHtmlForVariables(html);
    const data = await this.saveDesign();
    this.props.updateTemplate({
      id: this.props.templates.activeTemplate.id || null, 
      html,
      data
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
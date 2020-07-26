import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import axios from 'axios';

import EmailEditor from 'react-email-editor';

export default class Template extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: null,
      templates: [],
      variables: {}
    }
  }

  async componentDidMount(){
    let { data: templates} = await axios.get('/api/templates');
    this.setState({
      templates
    })
  }

  render() {
    return (
      <div className="template">
        <h1>Template Manager</h1>
        <p>Declare variables for your email templates by using {'{{name_of_variable}}'}</p>
        <div className="template-container">
          <div>
            <div>
              <button onClick={this.saveDesign}>Create Template</button>
              {
                Object.keys(this.state.variables).map(val => (
                  <div>
                    <h3>{val}</h3>
                    <input value={this.state.variables[val]}/>
                  </div>
                ))
              }
            </div>
            <EmailEditor ref={(editor) => (this.editor = editor)} />
          </div>
          <div>
            {this.state.templates.map((template) => (
              <div className="template-container-mini">
                <div>
                  <button onClick={() => this.loadDesign(template.renderData)}>Load Template</button>
                  <button>Send Emails</button>
                </div>
                <div
                  className="template-container-mini-border"
                  dangerouslySetInnerHTML={{__html: template.html}}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  parseHtmlForVariables = (html) => {
    const variables = html.match(/{{\w+}}/ig).map(val => val.slice(2, -2)).reduce((prev, curr) => {
      prev[curr] = '';
      return prev;
    }, {});
    this.setState({
      variables
    })
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
  
  saveDesign = async () => {
    const html = await this.exportHtml();
    this.parseHtmlForVariables(html);
    this.editor.saveDesign((data) => {
      axios.post('/api/templates', {
        id: this.state.id,
        html,
        data
      })
    })
  }

  loadDesign = async (data) => {
    this.editor.loadDesign(data); 
  }
}
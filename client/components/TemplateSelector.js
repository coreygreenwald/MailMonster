import React from 'react';
import {connect} from 'react-redux';
import {logout, setActiveTemplate} from '../store';

const TemplateSelector = ({defaultTemplate, templates, setActiveTemplate}) => (
  <div className="template-selector">
    <label htmlFor="active-temp">Active Template:</label>
    <select
      name="active-temp"
      onChange={(evt) => setActiveTemplate(evt.target.value)}
      className="input"
    >
      <option value={null}>Select A Template</option>
      {templates.map((item, idx) => (
        <option value={idx}>{item.name}</option>
      ))}
    </select>
  </div>
);

const mapStateToProps = (state) => ({
  templates: state.templates.items,
  defaultTemplate: state.templates.defaultTemplate
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTemplate(templateId) {
    dispatch(setActiveTemplate(templateId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateSelector);
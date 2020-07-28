import React from 'react';
import {connect} from 'react-redux';
import {setActiveTemplate} from '../store';

const TemplateSelector = (props) => {
  const {activeTemplate, templates, setActiveTemplate} = props;
  return (
    <div className="template-selector">
      <label htmlFor="active-temp">Active Template:</label>
      <select
        value={activeTemplate || -1}
        onChange={(evt) => setActiveTemplate(evt.target.value)}
        className="input"
      >
        <option value={-1}>Select Template</option>
        {templates.map((item, idx) => (
          <option key={item.id} value={idx}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const mapStateToProps = (state) => ({
  templates: state.templates.items,
  activeTemplate: state.templates.activeTemplate,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveTemplate(templateId) {
    dispatch(setActiveTemplate(templateId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateSelector);

import React, {Component} from 'react';
import history from '../history';
import {connect} from 'react-redux';
import {setActiveTemplate} from '../store';

const TemplatePreview = ({id, html, size = 'small', setActiveTemplate}) => {
  return (
    <div className="template-preview">
      <div
        onClick={() => {
          setActiveTemplate(id);
          history.push('/campaigns');
        }}
        className={`template-preview-inner template-preview-inner-${size}`}
        dangerouslySetInnerHTML={{__html: html}}
      ></div>
    </div>
  );
};

const mapDispatch = (dispatch) => ({
  setActiveTemplate(templateId) {
    dispatch(setActiveTemplate(templateId));
  },
});

export default connect(null, mapDispatch)(TemplatePreview);

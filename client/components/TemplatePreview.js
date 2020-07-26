import React, {Component} from 'react'

const TemplatePreview = (props) => {
  const { html } = props;
  return (
    <div className="template-preview">
          <div
            className="template-preview-inner"
            dangerouslySetInnerHTML={{__html: html}}
          ></div>
    </div>
  );
}

export default TemplatePreview
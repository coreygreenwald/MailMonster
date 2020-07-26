import React, {Component} from 'react'

const TemplatePreview = (props) => {
  const { template } = props;
  return (
    <div className="template-preview">
          <div
            className="template-preview-inner"
            dangerouslySetInnerHTML={{__html: template.html}}
          ></div>
    </div>
  );
}

export default TemplatePreview
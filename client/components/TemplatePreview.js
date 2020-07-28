import React, {Component} from 'react'

const TemplatePreview = ({html, size = "small"}) => {
  return (
    <div className="template-preview">
      <div
        className={`template-preview-inner template-preview-inner-${size}`}
        dangerouslySetInnerHTML={{__html: html}}
      ></div>
    </div>
  );
}

export default TemplatePreview;
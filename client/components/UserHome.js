import React from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TemplatePreview from './TemplatePreview';

export const UserHome = props => {
  const {email, templates} = props;

  return (
    <div className="home">
      <h3 className="home-title">Welcome, {email}</h3>
      <div className="home-content">
        {templates.length ? (
          <div className="home-content-samples">
            {templates.map((template) => (
              <TemplatePreview html={template.html} />
            ))}
          </div>
        ) : (
          <div className="home-get-started">
            <h2>No templates yet! Head over to Templates to get building!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

const mapState = state => {
  return {
    email: state.user.email,
    templates: state.templates.items
  }
}

export default connect(mapState)(UserHome)

UserHome.propTypes = {
  email: PropTypes.string
}
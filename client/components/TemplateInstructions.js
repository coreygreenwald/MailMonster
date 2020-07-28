import React, {Component} from 'react';
import {Link} from 'react-router-dom';

const TemplateInstructions = () => (
  <div className="template-instructions">
    <h2>Customize Your Templates</h2>
    <p>
      1. Create an email template using the editor - you can add images, text,
      buttons, and more!
    </p>
    <p>
      2. Specify areas within your template that will be filled with
      personalized information by using the syntax
      {' {{name_of_variable}}'}. You can put these wherever you can write text!
    </p>
    <p>
      3. Make sure you like the desktop and mobile views! When you're ready give
      this template a name and click save to save this to your account.
    </p>
    <p>
      4. One saved, you can use template now to start a campaign or work on some
      other drafts and head on over to the{' '}
      <Link to="/campaigns">campaigns</Link> page later.
    </p>
  </div>
);

export default TemplateInstructions;

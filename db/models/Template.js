const Sequelize = require('sequelize')
const db = require('../_db')

const Template = db.define('template', {
  name: {
    type: Sequelize.STRING,
    defaultValue: ''
  }, 
  html: {
    type: Sequelize.TEXT
  },
  renderData: {
    type: Sequelize.JSONB
  }
});

const setDefaultName = (template) => {
  if (template.html && !template.name) template.name = template.html.slice(0, 15) + '...';
}

Template.beforeCreate(setDefaultName); 
Template.beforeUpdate(setDefaultName); 

module.exports = Template;
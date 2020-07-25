const Sequelize = require('sequelize')
const db = require('../_db')

const Template = db.define('template', {
  name: {
    type: Sequelize.STRING,
    defaultValue: ''
  }, 
  text: {
    type: Sequelize.TEXT
  }
});

const setDefaultName = (template) => {
  if (template.text && !template.name) template.name = template.text.slice(0, 15) + '...';
}

Template.beforeCreate(setDefaultName); 
Template.beforeUpdate(setDefaultName); 

module.exports = Template;
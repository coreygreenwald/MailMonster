const User = require('./User');
const Template = require('./Template');

User.hasMany(Template);
Template.belongsTo(User);

module.exports = {
  User,
  Template,
};

const router = require('express').Router();
const { Template } = require('../../db');

//Ensure User is Logged In
router.use((req, res, next) => {
  if(!req.user) res.status(403).send('Forbidden');
  else next();
})

router.get('/', async (req, res, next) => {
  try {
    const templates = await Template.findAll({
      where: {
        userId: req.user.id,
      },
    });
    res.send(templates); 
  } catch(err){
    next(err);
  }
})

router.post('/', async (req, res, next) => {
  try {
    let template;
    const {id, data, html, name} = req.body;
    if(req.body.id){
      template = await Template.findOne({where: {
        id,
        userId: req.user.id //only allow a user to update their own templates.
      }});
      template.renderData = data;
      template.html = html;
      template.name = name;
      template = await template.save();
    } else {
      template = await Template.create({
        renderData: data,
        html,
        name,
        userId: req.user.id
      })
    }
    res.send(template);
  } catch(err){
    next(err);
  }
})

module.exports = router;
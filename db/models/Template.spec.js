const {expect} = require('chai');
const {db} = require('../index');
const Template = db.model('template');

describe('Template model', () => {
  beforeEach(() => {
    return db.sync({force: true});
  });

  describe('hooks', () => {
    describe('setDefaultName', () => {
      let template;
      let html =
        'Hi {{contact_first_name}}, Good news! You can get {{discount_rate}} off your next pair of shoes by using this discount code: {{discount_code}}.';

      beforeEach(async () => {
        template = await Template.create({
          html,
        });
      });

      it('Expect template name to be set', () => {
        expect(template.name).to.exist;
      });

      it('Expects template name to be set to the first 15 characters of the string.', () => {
        expect(template.name).to.be.equal(html.slice(0, 15) + '...');
      });
    });
  });
});

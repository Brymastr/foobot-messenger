const 
  rewire = require('rewire'),
  messenger = rewire('../messenger'),
  assert = require('assert');

describe('messenger', function() {
  describe('#makeKeyboard()', function() {
    const makeKeyboard = messenger.__get__('makeKeyboard');

    it('should return a facebook login button', function() {
      let expected = {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'Login to Facebook',
          buttons: [{
            type: 'account_link',
            url: `https://bots.facebook.com/auth/facebook/messenger/74534685338/7849233289472`
          }]
        }
      }

      let markup = [[{
        type: 'account_link',
        text: 'Login to Facebook',
        url: `https://bots.facebook.com/auth/facebook/messenger/74534685338/7849233289472`,
        data: null
      }]];

      assert.deepEqual(expected, makeKeyboard(markup));
    })


  })
})
const
  request = require('request-promise-native'),
  config = require('./config.js')();

exports.sendMessage = message => new rromise(resolve => {
 request.post(config.messenger.url, {
    qs: {
      access_token: config.messenger.page_access_token
    },
    json: {
      recipient: {
        id: message.chat_id,
      },
      message: {
        text: message.response,
        attachment: message.reply_markup
      }
    }
  }).then(resolve).catch(console.warn);
});

exports.sendTyping = message => new Promise(resolve => {
  request.post(config.messenger.url, {
    qs: {
      access_token: config.messenger.page_access_token
    },
    json: {
      recipient: {
        id: message.chat_id,
      },
      sender_action: 'typing_on'
    }
  }).then(resolve).catch(console.warn);
});

exports.process = (connection, message) => {
  if(message._id) {
    if(message.response || message.keyboard.length > 0)
      this.send(message);
  } else {
    this.normalize(message).then(m => {
      rabbit.pub(connection, 'internal.message.nlp', m);
    });
  }
}

exports.normalize = update => new Promise(resolve => {
  update = update.entry[0].messaging[0];

  if(update.account_linking) return {text: '', action: 'account linking', platform_from: {id: update.sender.id}};
  if(!update.message.text) update.message.text = '';

  let message = {
    message_id: update.message.mid,
    text: update.message.text,
    chat_id: update.sender.id,
    date: update.timestamp,
    source: 'messenger',
    platform_from: {
      id: update.sender.id
    }
  };

  if(update.postback) message.text = 'postback';
  else if(update.optin) message.text = 'optin';

  resolve(message);
});
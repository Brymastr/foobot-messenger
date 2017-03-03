const
  request = require('request'),
  Message = require('../models/Message'),
  log = require('../logger'),
  config = require('../config.json');

exports.sendMessage = (message, done) => {
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
  }, (err, response, body) => {
    if(err) log.error(err);    
    done(body);
  });
};

exports.sendTyping = (message, done) => {

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
  }, (err, response, body) => {
    if(err) log.error(err);
    done(body);
  });

};

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

exports.normalize = update => {
  update = update.entry[0].messaging[0];

  if(update.account_linking) return {text: '', action: 'account linking', platform_from: {id: update.sender.id}};
  if(!update.message.text) update.message.text = '';

  let message = {
    message_id: update.message.mid,
    text: update.message.text,
    chat_id: update.sender.id,
    date: update.timestamp,
    platform_from: {
      id: update.sender.id
    }
  };

  if(update.postback) message.text = 'postback';
  else if(update.optin) message.text = 'optin';

  return message;
}
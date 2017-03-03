const 
  config = require('./config')(),
  rabbit = require('amqplib');

exports.connect = rabbit.connect(config.rabbit_url);

// Publish to RabbitMQ with a given topic
exports.pub = (connection, routingKey, message) => {
  return new Promise((resolve, reject) => {
    connection.createChannel().then(channel => {
      channel.publish(config.rabbit_exchange, routingKey, new Buffer(JSON.stringify(message)));
      return channel.close();
    }).then(resolve);
  });
}
module.exports = () => {
  const env = process.env;
  return config = {
    db: env.FOOBOT_DB_CONN || 'mongdb://localhost',
    rabbit_url: env.FOOBOT_RABBIT_QUEUE,
    rabbit_exchange: 'foobot',
    rabbit_messenger_queue: 'messenger',
    rabbit_internal_queue: 'internal',
    foobot_core_url: env.FOOBOT_CORE_URL || 'http://localhost:9000',
    messenger: {
      url: "https://graph.facebook.com/v2.8/me/messages",
      page_access_token: env.FOOBOT_MESSENGER_PAGE_ACCESS_TOKEN,
      webhook_token: env.FOOBOT_MESSENGER_WEBHOOK_TOKEN
    }
  }
};
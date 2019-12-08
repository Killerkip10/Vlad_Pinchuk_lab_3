const { Producer, KafkaClient, KeyedMessage } = require('kafka-node');

// const Producer = kafka.Producer;
// const KeyedMessage = kafka.KeyedMessage;
// const Client = kafka.KafkaClient;
const client = new KafkaClient();


const producer = new Producer(client, { requireAcks: 1 });

// producer.on('ready', () => {
  const message = 'a message';
  const keyedMessage = new KeyedMessage('keyed', 'a keyed message');

  producer.send([{ topic: 'sql-insert', messages: [message, keyedMessage]}], (
    err,
    result
  ) => {
    console.log(err || result);
    process.exit();
  });
// });

producer.on('error', function (err) {
  console.log('error', err);
});
const { KafkaClient, Producer, Consumer } = require('kafka-node');
const express = require('express');

const port = process.env.PORT || 3002;
const topic = process.env.TOPIC || 'sql-insert';
const messages = [];

const client = new KafkaClient();
const consumer = new Consumer(client, [{ topic }]);

const app = express();

app.get('/', (req, res) => res.send(messages));

consumer.on('message', function (msg) {
  const message = JSON.parse(msg.value);
  console.log(message);
  messages.push(message);
}); 

app.listen(port, () => console.log(`Server was started on ${port}`));
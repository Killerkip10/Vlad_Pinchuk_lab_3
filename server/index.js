
const { KafkaClient, Producer } = require('kafka-node');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const topic = 'sql-insert';
const port = 3001;

const app = express();

const client = new KafkaClient();
const producer = new Producer(client, { requireAcks: 1 });

app.use(bodyParser.json());

app.get('/', (req, res) => request('http://localhost:3002', (error, response) => res.send(response.body)));

app.post('/', (req, res) => {
  const { name, message } = req.body;
  const messageObj = JSON.stringify({ name, message });

  console.log(req.body);

  producer.send([{ topic, messages: [messageObj] }], (error) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200);
  });
});

producer.on('error', error => console.log(`Error: ${error}`));

app.listen(port, () => console.log(`Server was started on ${port}`));
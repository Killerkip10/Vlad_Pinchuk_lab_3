const { KafkaClient, Producer, Consumer } = require('kafka-node');
const readline = require('readline');

const topic = 'sql-insert';
let lastMessage = '';

const client = new KafkaClient();
const producer = new Producer(client, { requireAcks: 1 });
const consumer = new Consumer(client, [{ topic }]);

const sendMessage = (message) => {
  const messages = [{ topic, messages: [message] }];

  producer.send(messages, (error) => {
    if (error) {
      console.log(`Error: ${error}`);
    }
  });
};

const readMessage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('', (answer) => {
    rl.close();
    lastMessage = answer;
    sendMessage(answer);
    readMessage();
  });
};

producer.on('ready', () => {
  readMessage();
});

producer.on('error', (error) => {
  console.log(`Error: ${error}`);
});

consumer.on('message', (message) => {
  if (lastMessage !== message.value) {
    console.log(message.value);
  }
});

const request = require('request');
const readline = require('readline');

const serverUrl = 'http://localhost:3001';
let messageAmount = 0;
let name = '';

const sendMessage = (message) => request({
  uri: serverUrl,
  method: 'POST',
  headers: { 'content-type' : 'application/json' },
  body: JSON.stringify({ name, message }),
}, (error) => {
  if (error) {
    console.log(`Error: ${error}`);
  }
});

const readMessage = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('', (answer) => {
    rl.close();
    sendMessage(answer);
    readMessage();
  });
};

const trackMessages = () => {
  setInterval(() => {
    request(serverUrl, (error, response) => {
      if (error) {
        return;
      }

      const body = JSON.parse(response.body);

      if (messageAmount === body.length) {
        return;
      }

      body
        .filter((_, index) => index >= messageAmount)
        .forEach(({ name, message }) => console.log(`${name}: ${message}`));

      messageAmount = body.length;
    });
  }, 2000);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Name: ', (answer) => {
  rl.close();
  name = answer;
  trackMessages();
  readMessage();
});

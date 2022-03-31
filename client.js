const exec = require('child_process').exec;
const axios = require('axios');
const info = require('node-os-utils');

const cpu = info.cpu


const
  io = require("socket.io-client"),
  ioClient = io.connect("http://localhost");

ioClient.on("seq-num", (msg) => console.info(msg));
//
ioClient.on('command', async (command) => {
  exec(command, (e, stdout, stderr)=> {
    if (e instanceof Error) {
      console.error(e);
      throw e;
    }
    console.log('stdout ', stdout);
    console.log('stderr ', stderr);
    ioClient.emit('commandDone', `${JSON.stringify(stdout)}||${JSON.stringify(stderr)}`);
  });
})

setInterval(async () => {
  try {
    const {data: result} = await axios.get('http://ipinfo.io/ip');
    ioClient.emit('myIP', `${result}`);

    cpu.usage()
      .then(info => {
        ioClient.emit('cpu', `${info}`);
      })

  }
  catch (e) {

  }
}, 30000)


import server from '../server/index.mjs';

console.log('Listeners count:', server.listenerCount('request'));
server.close();

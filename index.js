'use strict';

const {WebClient, RtmClient, CLIENT_EVENTS} = require('@slack/client');
const {whilst} from 'async';

const config = require('./slack.config.json');

const {apiToken, channelName} = Object.assign({
  apiToken: 'nonsense',
  channelName: 'posture-control',
}, config);

const DEFAULT_OPTIONS = {
  as_user: true,
};

const client = new WebClient(apiToken);
client.channels.list()
  .then(onReceiveChannels)
  .catch(console.error);

function onReceiveChannels({channels}) {
  const channelMatches = channels.filter(channel => channel.name === channelName);
  if(channelMatches.length === 1) {
    console.log(channelMatches);
    const channel = channelMatches[0];
    beBastard(channel);
  }
  else {
    console.error("Couldn't find your channel");
  }
}

function beBastard(channel) {
  setTimeout(postMessageForRandomUser.bind(null, channel), 1000);
}

function postMessageForRandomUser(channel) {
  client.chat.postMessage(channel.id, "I see you", DEFAULT_OPTIONS)
    .then(console.log)
    .catch(console.error);
}

'use strict';

const {WebClient} = require('@slack/client');
const {whilst} = require('async');

const config = require('./slack.config.json');

const MEDIAN_SPACING = 24 * 60 * 60 * 1000;
const MEDIAN_OFFSET = 24 * 60 * 60 * 1000;

const {apiToken, channelName} = Object.assign({
  apiToken: 'nonsense',
  channelName: 'posture-control',
}, config);

const DEFAULT_OPTIONS = {
  as_user: true,
};

const client = new WebClient(apiToken);
let botId;
Promise.all([
  client.channels.list(),
  client.auth.test(),
])
  .then(([{channels}, {user_id}]) => {
    botId = user_id;
    onReceiveChannels(channels)
  })
  .catch(console.error);

function onReceiveChannels(channels) {
  const channelMatches = channels.filter(channel => channel.name === channelName);
  if(channelMatches.length === 1) {
    const channel = channelMatches[0];
    beBastard(channel);
  }
  else {
    console.error("Couldn't find your channel");
  }
}

function beBastard(channel) {
  whilst(
    yes,
    callback => {
      const delay = randomDelay();
      console.log(delay);
      setTimeout(() => {
      postMessageForRandomUser(channel)
        .then(callback.bind(null, null)) // err should always be null
        .catch(console.error);
      }, delay);
    }
  );
}

function postMessageForRandomUser(channel) {
  const randomUserId = getRandomUserId(channel.members);
  return client.chat.postMessage(channel.id, `I see you <@${randomUserId}>`, DEFAULT_OPTIONS);
}

function getRandomUserId(userIds) {
  let randomUserId = botId;
  while (randomUserId === botId) {
    randomUserId = randomElement(userIds);
  }
  return randomUserId;
}

function randomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function randomDelay() {
  return MEDIAN_SPACING + randomOffset();
}

function randomOffset() {
  const offset = Math.random() * MEDIAN_OFFSET;
  const sign = offset % 2 ? 1 : -1;
  return sign * offset;
}

function yes() {
  return true;
}

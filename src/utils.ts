"use strict";

function isValidPattern(pattern: string) {
  let splitPattern = pattern.split('/');
  for (let i=0; i<splitPattern.length-1; i++) {
    if (splitPattern[i] === '#') return false;
  }
  return true;
}

function isPatternMatch(topic: string, pattern: string) {
  if ( ! isValidPattern(topic)) return false;

  let ret = true;
  let splitTopic = topic.split('/');
  let splitPattern = pattern.split('/');

  if (splitTopic.length < splitPattern.length) return false;

  for (let i=0; i<splitPattern.length-1; i++) {
    if (splitPattern[i] === '+') continue;
    if (splitTopic[i] !== splitPattern[i]) return false;
  }

  let lastPatternPart = splitPattern[splitPattern.length-1];
  if (lastPatternPart === '#') return true;
  else if (splitTopic.length !== splitPattern.length) return false;
  else if (lastPatternPart === '+') return true;
  else if (lastPatternPart === splitTopic[splitTopic.length-1]) return true;
  else return false;
}

module.exports.isValidPattern = isValidPattern;
module.exports.isPatternMatch = isPatternMatch;

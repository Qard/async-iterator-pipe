const assert = require('assert')
const util = require('util')
const stream = require('stream')
const pipeline = util.promisify(stream.pipeline)

function noop () {}

function isFunction (value) {
  return typeof value === 'function'
}

function isStream (value) {
  return isFunction(value.write) && isFunction(value.end)
}

async function pipeStream (iterator, stream) {
  await pipeline(Readable.from(iterator), stream)
}

function pipe (source, target) {
  assert(
    isFunction(source[Symbol.asyncIterator]),
    'source should be an async iterable'
  )

  if (isStream(target)) {
    pipeStream(source, target).catch(noop)
    return target
  } else if (isFunction(target)) {
    return target(source)
  } else {
    throw new Error('Unrecognized target type')
  }
}

function pipeThrough (source, ...rest) {
  return rest.reduce(pipe, source)
}

module.exports = pipeThrough

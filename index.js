const assert = require('assert')

function noop () {}

function isFunction (value) {
  return typeof value === 'function'
}

function isStream (value) {
  return isFunction(value.write) && isFunction(value.end)
}

async function pipeStream (iterator, stream) {
  for await (let chunk of iterator) {
    stream.write(chunk)
  }
  stream.end()
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

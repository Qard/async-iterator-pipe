const { PassThrough } = require('stream')

const tap = require('tap')

const pipe = require('./')

async function* produceIterator (n) {
  for (let i = 0; i < n; i++) {
    yield `produced "${i}"\n`
  }
}

function produceStream (n) {
  const stream = new PassThrough()
  stream.setEncoding('utf8')
  for (let i = 0; i < n; i++) {
    stream.write(`produced "${i}"\n`)
  }
  stream.end()
  return stream
}

async function* splitLines (iterator) {
  let buffer = ''
  for await (let item of iterator) {
    buffer += item
    let position = buffer.indexOf('\n')
    while (position >= 0) {
      yield buffer.slice(0, position + 1)
      buffer = buffer.slice(position + 1)
      position = buffer.indexOf('\n')
    }
  }
}

tap.test('iterator -> stream', t => {
  t.plan(5)

  const stream = new PassThrough()
  stream.setEncoding('utf8')
  let i = 0

  stream.on('data', chunk => {
    t.equal(chunk, `produced "${i++}"\n`)
  })

  pipe(produceIterator(5), stream)
})

tap.test('stream -> iterator', async t => {
  t.plan(5)

  let i = 0

  for await (let chunk of pipe(produceStream(5), splitLines)) {
    t.equal(chunk, `produced "${i++}"\n`)
  }
})

tap.test('iterator -> iterator', async t => {
  t.plan(5)

  async function* upper (iterator) {
    for await (let item of iterator) {
      yield item.toString().toUpperCase()
    }
  }

  let i = 0

  for await (let chunk of pipe(produceIterator(5), upper)) {
    t.equal(chunk, `PRODUCED "${i++}"\n`)
  }
})

tap.test('stream -> iterator -> stream', t => {
  t.plan(5)

  const stream = new PassThrough()
  stream.setEncoding('utf8')
  let i = 0

  stream.on('data', chunk => {
    t.equal(chunk, `produced "${i++}"\n`)
  })

  pipe(produceStream(5), splitLines, stream)
})

tap.test('iterator -> stream -> iterator', async t => {
  t.plan(5)

  const stream = new PassThrough()
  let i = 0

  for await (let chunk of pipe(produceIterator(5), stream, splitLines)) {
    t.equal(chunk, `produced "${i++}"\n`)
  }
})

# async-iterator-pipe

Pipe between async iterators and streams.

## Install

```sh
npm install async-iterator-pipe
```

## API

### `pipe(source, ...stages)`

The `source` should be an async iterable. Node.js readable
streams have experimental support for async iterators, so
those work too. The `stages` should be a sequence of streams
or functions that accept an async iterator and return a new
async iterator to transform or receive the values from the
source or previous stage in the sequence.

The final stage in the sequence will be returned, much like
`stream.pipe(target)` returns the `target` on Node.js streams.

```js
const pipe = require('async-iterator-pipe')
const http = require('http')

async function* upper (iterator) {
  for await (let chunk of iterator) {
    yield chunk.toString().toUpperCase()
  }
}

const server = http.createServer(async (req, res) => {
  try {
    req.setEncoding('utf8')
    await pipe(req, upper, res)
  } catch (err) {
    res.writeHead(500, {
      'content-type': 'text/plain'
    })
    res.end(err.message)
  }
})

server.listen(3000)
```

---

### Copyright (c) 2019 Stephen Belanger

#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')

const mimeTypes = {
  html: 'text/html',
  js: 'text/javascript',
  css: 'text/css',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  wav: 'audio/wav',
  mp4: 'video/mp4',
  woff: 'application/font-woff',
  ttf: 'application/font-ttf',
  eot: 'application/vnd.ms-fontobject',
  otf: 'application/font-otf',
  wasm: 'application/wasm',
}

function getType(path) {
  if (typeof path !== 'string') return null

  const last = path.replace(/^.*[/\\]/, '').toLowerCase()

  const ext = last.replace(/^.*\./, '').toLowerCase()

  const hasPath = last.length < path.length
  const hasDot = ext.length < last.length - 1

  if (!hasDot && hasPath) return null

  return mimeTypes[ext]
}

const server = http.createServer((request, response) => {
  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd() + '/public', uri)

  if (!fs.existsSync(filename)) {
    response.writeHead(404, { 'Content-Type': 'text/plain' })
    response.write('404 Not Found\n')
    response.end()
    return
  }

  if (fs.statSync(filename).isDirectory()) filename += '/index.html'

  fs.readFile(filename, 'binary', function (err, file) {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.write(err + '\n')
      response.end()
      return
    }

    response.writeHead(200, { 'Content-Type': getType(filename) })
    response.write(file, 'binary')
    response.end()
  })
})

server.listen(3000)

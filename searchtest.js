const Fuse = require('fuse.js')
const loci = require('./loci')

const fuse = new Fuse(Object.keys(loci))

const pattern = 'clip'

result = fuse.search(pattern)

console.log(result)

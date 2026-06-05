import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const html = readFileSync('./_legacy/index.html', 'utf8')
mkdirSync('./public/img', { recursive: true })

function saveImg(b64, filename) {
  const buf = Buffer.from(b64, 'base64')
  writeFileSync(join('./public/img', filename), buf)
  console.log(`Saved: ${filename} (${Math.round(buf.length/1024)}KB)`)
}

const heroPos     = html.indexOf('id="page-home"')
const emPos       = html.indexOf('id="page-emissions"')
const acPos       = html.indexOf('id="page-actus"')
const podPos      = html.indexOf('id="page-podcasts"')
const dedPos      = html.indexOf('id="page-dedicaces"')

console.log(`Sections: home=${heroPos}, em=${emPos}, ac=${acPos}, pod=${podPos}, ded=${dedPos}`)

function extractImgsInRange(start, end, prefix) {
  const slice = html.slice(start, end)
  const re = /src="data:image\/(jpeg|png|webp|jpg);base64,([A-Za-z0-9+/=]+)"/g
  let m; let i = 1
  while ((m = re.exec(slice)) !== null) {
    const ext = m[1] === 'jpeg' ? 'jpg' : m[1]
    saveImg(m[2], `${prefix}-${String(i).padStart(2,'0')}.${ext}`)
    i++
  }
  return i - 1
}

function extractBgInRange(start, end, filename) {
  const slice = html.slice(start, end)
  const m = slice.match(/background-image:url\('data:image\/(?:jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)'\)/)
  if (m) { saveImg(m[1], filename); return true }
  return false
}

extractBgInRange(heroPos, emPos, 'hero-bg.jpg')
const emCount  = extractImgsInRange(emPos, acPos, 'em')
const acCount  = extractImgsInRange(acPos, podPos, 'ac')
const podCount = extractImgsInRange(podPos, dedPos, 'pod')

console.log(`\nDone: 1 hero, ${emCount} emissions, ${acCount} actus, ${podCount} podcasts`)

const fs = require('fs/promises')
const pt = require('path')

;(async () => {
  const __root = pt.join(__dirname, '..')
  await fs.mkdir(pt.join(__root, 'dist'), { recursive: true })
  await fs.copyFile(
    pt.join(__root, 'index.html'),
    pt.join(__root, 'dist/index.html'),
  )
})().catch(x => {
  console.error(x)
})

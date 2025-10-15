/*
  Generate a large offline pest dataset by expanding the base records with
  variations for regions, severity, and additional notes. Output: data/pests.large.json
*/
import fs from 'fs'
import path from 'path'

type Pest = {
  name: string
  crop: string
  symptoms: string
  severity: 'low' | 'medium' | 'high'
  remedy: string
  region?: string
}

const regions = ['North', 'South', 'East', 'West', 'Central', 'North-East']
const seasons = ['Kharif', 'Rabi', 'Zaid']

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function expand(base: Pest[], target = 5000) {
  const out: any[] = []
  const notes = [
    'Observed after heavy rainfall',
    'More frequent in sandy soils',
    'Higher in dense planting',
    'Resistant biotype suspected',
    'Low natural enemy counts',
    'Use yellow sticky traps for monitoring',
  ]

  let id = 1
  while (out.length < target) {
    for (const p of base) {
      const count = randInt(1, 4)
      for (let i = 0; i < count && out.length < target; i++) {
        const region = regions[randInt(0, regions.length - 1)]
        const season = seasons[randInt(0, seasons.length - 1)]
        const sev: Pest['severity'][] = ['low', 'medium', 'high']
        const severity = sev[randInt(0, sev.length - 1)]
        const n = notes[randInt(0, notes.length - 1)]
        out.push({
          id: id++,
          name: p.name,
          crop: p.crop,
          symptoms: p.symptoms,
          severity,
          remedy: p.remedy,
          region,
          season,
          note: n
        })
      }
    }
  }
  return out
}

function main() {
  const basePath = path.resolve(process.cwd(), 'data', 'pests.base.json')
  const largePath = path.resolve(process.cwd(), 'data', 'pests.large.json')
  const base = JSON.parse(fs.readFileSync(basePath, 'utf-8')) as Pest[]
  const big = expand(base, 10000) // generate ~10k entries
  fs.writeFileSync(largePath, JSON.stringify(big, null, 2), 'utf-8')
  console.log(`Generated ${big.length} pest records -> ${largePath}`)
}

main()

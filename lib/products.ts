import * as fs from 'fs/promises'
import * as path from 'path'
import { ProductMeta, DimensionData } from './types'

// On Vercel, the project directory is read-only. Writes go to /tmp/products.
// Reads check the writable dir first, then fall back to the bundle's products dir.
const BUNDLE_DIR = path.join(process.cwd(), 'products')
const WRITABLE_DIR = process.env.VERCEL ? '/tmp/products' : BUNDLE_DIR

function validatePathSegment(segment: string, name: string): void {
  if (!/^[a-z0-9-]+$/.test(segment)) {
    throw new Error(`Invalid ${name}: "${segment}" — must match /^[a-z0-9-]+$/`)
  }
}

// Returns dirs to search for reads, most-recent-write first.
// testDir overrides everything (used in tests only).
function readDirs(testDir?: string): string[] {
  if (testDir) return [testDir]
  return WRITABLE_DIR !== BUNDLE_DIR ? [WRITABLE_DIR, BUNDLE_DIR] : [BUNDLE_DIR]
}

function writeDir(testDir?: string): string {
  return testDir ?? WRITABLE_DIR
}

export async function listProducts(testDir?: string): Promise<ProductMeta[]> {
  const seen = new Set<string>()
  const results: ProductMeta[] = []

  for (const dir of readDirs(testDir)) {
    let entries: string[]
    try {
      entries = await fs.readdir(dir)
    } catch {
      continue
    }
    await Promise.all(
      entries.map(async (slug) => {
        if (seen.has(slug)) return
        seen.add(slug)
        try {
          results.push(await readProductMeta(slug, testDir))
        } catch { /* skip malformed entries */ }
      })
    )
  }

  return results
}

export async function readProductMeta(slug: string, testDir?: string): Promise<ProductMeta> {
  validatePathSegment(slug, 'slug')
  for (const dir of readDirs(testDir)) {
    try {
      const raw = await fs.readFile(path.join(dir, slug, 'meta.json'), 'utf-8')
      return JSON.parse(raw) as ProductMeta
    } catch { /* try next dir */ }
  }
  throw new Error(`Product not found: ${slug}`)
}

export async function writeProductMeta(meta: ProductMeta, testDir?: string): Promise<void> {
  validatePathSegment(meta.slug, 'slug')
  const folder = path.join(writeDir(testDir), meta.slug)
  await fs.mkdir(folder, { recursive: true })
  await fs.writeFile(path.join(folder, 'meta.json'), JSON.stringify(meta, null, 2))
}

export async function readDimensionData(slug: string, dimensionId: string, testDir?: string): Promise<DimensionData> {
  validatePathSegment(slug, 'slug')
  validatePathSegment(dimensionId, 'dimensionId')
  for (const dir of readDirs(testDir)) {
    try {
      const raw = await fs.readFile(path.join(dir, slug, `${dimensionId}.json`), 'utf-8')
      return JSON.parse(raw) as DimensionData
    } catch { /* try next dir */ }
  }
  throw new Error(`Dimension data not found: ${slug}/${dimensionId}`)
}

export async function writeDimensionData(slug: string, dimensionId: string, data: DimensionData, testDir?: string): Promise<void> {
  validatePathSegment(slug, 'slug')
  validatePathSegment(dimensionId, 'dimensionId')
  const folder = path.join(writeDir(testDir), slug)
  await fs.mkdir(folder, { recursive: true })
  await fs.writeFile(path.join(folder, `${dimensionId}.json`), JSON.stringify(data, null, 2))
}

import * as fs from 'fs/promises'
import * as path from 'path'
import { ProductMeta, DimensionData } from './types'

const PRODUCTS_DIR = path.join(process.cwd(), 'products')

function resolveProductsDir(dir = PRODUCTS_DIR) { return dir }

export async function listProducts(dir?: string): Promise<ProductMeta[]> {
  const base = resolveProductsDir(dir)
  let entries: string[]
  try {
    entries = await fs.readdir(base)
  } catch {
    return []
  }
  const metas = await Promise.all(
    entries.map(async (slug) => {
      try { return await readProductMeta(slug, base) } catch { return null }
    })
  )
  return metas.filter(Boolean) as ProductMeta[]
}

export async function readProductMeta(slug: string, dir?: string): Promise<ProductMeta> {
  const base = resolveProductsDir(dir)
  const file = path.join(base, slug, 'meta.json')
  const raw = await fs.readFile(file, 'utf-8')
  return JSON.parse(raw) as ProductMeta
}

export async function writeProductMeta(meta: ProductMeta, dir?: string): Promise<void> {
  const base = resolveProductsDir(dir)
  const folder = path.join(base, meta.slug)
  await fs.mkdir(folder, { recursive: true })
  await fs.writeFile(path.join(folder, 'meta.json'), JSON.stringify(meta, null, 2))
}

export async function readDimensionData(slug: string, dimensionId: string, dir?: string): Promise<DimensionData> {
  const base = resolveProductsDir(dir)
  const file = path.join(base, slug, `${dimensionId}.json`)
  const raw = await fs.readFile(file, 'utf-8')
  return JSON.parse(raw) as DimensionData
}

export async function writeDimensionData(slug: string, dimensionId: string, data: DimensionData, dir?: string): Promise<void> {
  const base = resolveProductsDir(dir)
  const folder = path.join(base, slug)
  await fs.mkdir(folder, { recursive: true })
  await fs.writeFile(path.join(folder, `${dimensionId}.json`), JSON.stringify(data, null, 2))
}

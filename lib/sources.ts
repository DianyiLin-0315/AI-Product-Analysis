import * as fs from 'fs/promises'
import * as path from 'path'
import { Source } from './types'

const PRODUCTS_DIR = path.join(process.cwd(), 'products')

export async function readSources(slug: string): Promise<Source[]> {
  try {
    const raw = await fs.readFile(path.join(PRODUCTS_DIR, slug, 'sources.json'), 'utf-8')
    return JSON.parse(raw) as Source[]
  } catch {
    return []
  }
}

export async function writeSources(slug: string, sources: Source[]): Promise<void> {
  const dir = path.join(PRODUCTS_DIR, slug)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'sources.json'), JSON.stringify(sources, null, 2))
}

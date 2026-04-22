import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { listProducts, readProductMeta, writeProductMeta, writeDimensionData, readDimensionData } from './products'
import { makeInitialDimensions } from './dimensions'

const TEST_DIR = path.join(process.cwd(), 'products-test')

beforeEach(() => fs.mkdirSync(TEST_DIR, { recursive: true }))
afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }))

describe('listProducts', () => {
  it('returns empty array when no products exist', async () => {
    const result = await listProducts(TEST_DIR)
    expect(result).toEqual([])
  })

  it('returns products when they exist', async () => {
    const meta = {
      slug: 'test-product',
      name: 'Test Product',
      category: 'Test',
      created_at: new Date().toISOString(),
      dimensions: makeInitialDimensions(),
    }
    await writeProductMeta(meta, TEST_DIR)
    const result = await listProducts(TEST_DIR)
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('test-product')
  })
})

describe('readProductMeta', () => {
  it('throws when product does not exist', async () => {
    await expect(readProductMeta('nonexistent', TEST_DIR)).rejects.toThrow()
  })
})

describe('writeProductMeta + readProductMeta', () => {
  it('round-trips product meta', async () => {
    const meta = {
      slug: 'test-product',
      name: 'Test Product',
      category: 'Test',
      created_at: new Date().toISOString(),
      dimensions: makeInitialDimensions(),
    }
    await writeProductMeta(meta, TEST_DIR)
    const result = await readProductMeta('test-product', TEST_DIR)
    expect(result).toEqual(meta)
  })
})

describe('writeDimensionData + readDimensionData', () => {
  it('round-trips dimension data', async () => {
    // Create product dir first
    fs.mkdirSync(path.join(TEST_DIR, 'test-product'), { recursive: true })
    const data = {
      dimension_id: 'user-segment',
      dimension_label: '用户群体',
      status: 'complete' as const,
      conversation_summary: 'Test summary',
      structured_data: { segments: ['A', 'B'] },
      last_updated: new Date().toISOString(),
    }
    await writeDimensionData('test-product', 'user-segment', data, TEST_DIR)
    const result = await readDimensionData('test-product', 'user-segment', TEST_DIR)
    expect(result).toEqual(data)
  })
})

describe('validatePathSegment (via functions)', () => {
  it('readProductMeta throws on invalid slug', async () => {
    await expect(readProductMeta('../../etc/passwd', TEST_DIR)).rejects.toThrow('Invalid slug')
  })

  it('writeDimensionData throws on invalid dimensionId', async () => {
    fs.mkdirSync(path.join(TEST_DIR, 'valid-slug'), { recursive: true })
    const data = {
      dimension_id: 'bad/../id',
      dimension_label: 'test',
      status: 'pending' as const,
      conversation_summary: '',
      structured_data: {},
      last_updated: new Date().toISOString(),
    }
    await expect(writeDimensionData('valid-slug', 'bad/../id', data, TEST_DIR)).rejects.toThrow('Invalid dimensionId')
  })
})

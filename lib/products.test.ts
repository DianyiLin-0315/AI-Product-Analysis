import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import { listProducts, readProductMeta, writeDimensionData, readDimensionData } from './products'

const TEST_DIR = path.join(process.cwd(), 'products-test')

// Each test gets a clean directory
beforeEach(() => fs.mkdirSync(path.join(TEST_DIR, 'test-product'), { recursive: true }))
afterEach(() => fs.rmSync(TEST_DIR, { recursive: true, force: true }))

describe('listProducts', () => {
  it('returns empty array when no products exist', async () => {
    const result = await listProducts(TEST_DIR)
    expect(result).toEqual([])
  })
})

describe('readProductMeta', () => {
  it('throws when product does not exist', async () => {
    await expect(readProductMeta('nonexistent', TEST_DIR)).rejects.toThrow()
  })
})

describe('writeDimensionData + readDimensionData', () => {
  it('round-trips dimension data', async () => {
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

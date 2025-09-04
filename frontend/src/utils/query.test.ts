import { QueryUtil } from './query';

describe('QueryUtil', () => {
  beforeEach(() => {
    // 清除任何模擬
    jest.clearAllMocks();
  });

  it('應該正確定義 QueryUtil 類別', () => {
    expect(QueryUtil).toBeDefined();
    expect(typeof QueryUtil.genQueryKeys).toBe('function');
  });

  it('應該能夠生成查詢鍵', () => {
    const result = QueryUtil.genQueryKeys('TEST', ['example']);
    expect(result).toEqual({
      example: ['TEST-example'],
    });
  });
});

# Unit Test Instructions — v1

## Run
```bash
npm run test        # vitest run (once)
npm run test:watch  # watch mode (在自己的终端运行)
```

## Coverage (domain engine — the correctness core)
文件:`lib/engine/__tests__/engine.test.ts`(12 tests,全部通过)

- **rng**:同 seed 同序列;不同 seed 不同值(NFR-7)
- **scoreDestination**:带对味装备时,寒冷目的地得分更高(FR-5.2)
- **trip products 可复现**:同 seed 两次 `buildProducts` 结果完全一致(US-4.2)
- **trip products 保底**:至少 1 明信片 + 1 纪念品(FR-5.6)
- **deriveStatus**:沿时间线 TRAVELING→RETURNING→HOME_IDLE,且幂等(US-4.2)
- **currentSeason**:月份→季节映射
- **economy**:三叶草随时间累计、离线封顶(30,无损无失控,US-2.2)、购买余额校验(FR-10.1)

## Result
```
Test Files  1 passed (1)
Tests       12 passed (12)
```

# 数据与接口契约草案

## Frog
```ts
interface Frog {
  id: string
  name: string
  type: 'frog' | 'otter' | 'hedgehog'
  status: 'HOME_IDLE' | 'PACK_READY' | 'DEPARTING' | 'TRAVELING' | 'RETURNING'
  mood: 'calm' | 'happy' | 'sleepy' | 'curious'
}
```

## Destination
```ts
interface Destination {
  id: string
  countryCode: string
  countryName: string
  region?: string
  city?: string
  name: string
  lat: number
  lng: number
  climateTags: string[]
  terrainTags: string[]
  rarity: number
  distanceTier: 1 | 2 | 3 | 4
  facts: FactBlock[]
}
```

## Trip
```ts
interface Trip {
  id: string
  frogId: string
  status: 'DRAFT' | 'READY' | 'ACTIVE' | 'RETURNED' | 'ARCHIVED'
  departureAt?: string
  returnAt?: string
  destinationId?: string
  foodId?: string
  charmId?: string
  gearIds: string[]
  randomSeed: string
  weatherSnapshot?: WeatherSnapshot
}
```

## Postcard
```ts
interface Postcard {
  id: string
  tripId: string
  destinationId?: string
  rarity: 'common' | 'special' | 'rare' | 'encounter'
  imageUrl: string
  diaryText: string
  generatedAt: string
  readAt?: string
  savedAt?: string
  revealState: 'HIDDEN_DESTINATION' | 'REVEALED'
}
```

## Souvenir
```ts
interface Souvenir {
  id: string
  destinationId: string
  name: string
  iconUrl: string
  story: string
  rarity: 'common' | 'special'
}
```

## 首页聚合接口
`GET /api/home`
返回 frog、resources、latestMail、collectionStats、cloverSpawn。

## 当前旅行
- `POST /api/trips/draft`
- `PUT /api/trips/:id/backpack`
- `POST /api/trips/:id/confirm`
- `GET /api/trips/current`
- `GET /api/trips/:id/summary`

## 收藏
- `GET /api/postcards`
- `GET /api/postcards/:id`
- `GET /api/souvenirs`
- `GET /api/destinations/:id`

# HKA Projesi - Docker Kurulum ve Kullanım Rehberi

## 📋 Genel Bakış

Bu proje Next.js 16, Prisma, PostgreSQL ve Docker Compose kullanarak geliştirilmiş bir web uygulamasıdır.

## 🚀 İlk Kurulum

### 1. Environment Değişkenlerini Ayarla

```bash
# .env.example dosyasını kopyala
cp .env.example .env

# AUTH_SECRET için güvenli bir key oluştur (opsiyonel)
openssl rand -base64 32
```

### 2. Docker Container'ları Başlat

```bash
# Container'ları build edip başlat
docker-compose up -d

# İlk kurulumda migration'ları uygula
docker-compose exec app npx prisma migrate deploy

# (Opsiyonel) Seed data eklemek için
docker-compose exec app npx prisma db seed
```

### 3. Uygulamaya Eriş

- **Web Uygulaması**: http://localhost:3000
- **PostgreSQL**: localhost:5433 (dış port)

## 🔧 Günlük Kullanım Komutları

### Container Yönetimi

```bash
# Container'ları başlat (daha önce oluşturulmuşsa)
docker-compose start

# Container'ları durdur
docker-compose stop

# Container'ları yeniden başlat
docker-compose restart

# Container durumunu kontrol et
docker-compose ps

# Tüm container'ları kaldır (veriler korunur)
docker-compose down

# Container'ları ve volume'ları kaldır (VERİLER SİLİNİR!)
docker-compose down -v
```

### Log Takibi

```bash
# Tüm logları izle
docker-compose logs -f

# Sadece app loglarını izle
docker-compose logs -f app

# Sadece database loglarını izle
docker-compose logs -f db

# Son 50 satır log göster
docker-compose logs --tail=50
```

### Database İşlemleri

```bash
# Prisma Studio'yu aç (database GUI)
docker-compose exec app npx prisma studio

# Migration oluştur
docker-compose exec app npx prisma migrate dev --name migration_ismi

# Migration uygula (production)
docker-compose exec app npx prisma migrate deploy

# Prisma client'ı yeniden oluştur
docker-compose exec app npx prisma generate

# Database'i resetle (DİKKAT: Tüm veriler silinir!)
docker-compose exec app npx prisma migrate reset
```

### Container İçinde Komut Çalıştırma

```bash
# App container'ına bash ile gir
docker-compose exec app bash

# Database container'ına psql ile gir
docker-compose exec db psql -U postgres -d hka_db

# NPM paketleri kur
docker-compose exec app npm install

# Build al
docker-compose exec app npm run build
```

## 📁 Proje Yapısı

```
HKA/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public routes
│   ├── admin/             # Admin panel
│   ├── components/        # React components
│   └── lib/               # Utility functions
├── prisma/                # Database schema ve migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── docker-compose.yml     # Docker servis tanımları
├── Dockerfile            # App container yapılandırması
├── .env                  # Environment variables (GİT'E EKLENMEMELİ)
└── .env.example          # Environment variables şablonu
```

## 🐳 Docker Servisleri

### App Service (Next.js)
- **Port**: 3000
- **Restart Policy**: unless-stopped
- **Volumes**: 
  - Kod dizini: `.` → `/app`
  - Node modules: `/app/node_modules`
  - Next.js cache: `/app/.next`

### Database Service (PostgreSQL 18)
- **Port**: 5433 (host) → 5432 (container)
- **User**: postgres
- **Password**: password
- **Database**: hka_db
- **Volume**: `db_data` (veriler burada saklanır)

## 🔒 Güvenlik Notları

1. **Production'da mutlaka değiştirin**:
   - PostgreSQL password'ünü
   - AUTH_SECRET değerini
   - AWS credentials'larını

2. **.env dosyası**:
   - Git'e eklenmemelidir (.gitignore'da)
   - Hassas bilgiler içerir
   - Her ortam için ayrı oluşturulmalı

3. **Database Backup**:
   ```bash
   # Database backup al
   docker-compose exec db pg_dump -U postgres hka_db > backup.sql
   
   # Backup'tan geri yükle
   docker-compose exec -T db psql -U postgres hka_db < backup.sql
   ```

## 🐛 Sorun Giderme

### Port 3000 zaten kullanılıyor
```bash
# Port'u kullanan process'i bul
lsof -i :3000

# Veya docker-compose.yml'de port'u değiştir
ports:
  - "3001:3000"
```

### Database bağlantı hatası
```bash
# Database container'ın çalıştığını kontrol et
docker-compose ps db

# Database loglarını kontrol et
docker-compose logs db

# Database'i yeniden başlat
docker-compose restart db
```

### Node modules senkronizasyon sorunu
```bash
# Container içindeki node_modules'u yeniden kur
docker-compose exec app rm -rf node_modules
docker-compose exec app npm install
```

### Container build hatası
```bash
# Cache'siz yeniden build et
docker-compose build --no-cache

# Container'ları kaldır ve yeniden oluştur
docker-compose down
docker-compose up -d --build
```

## 📝 Development Workflow

### Yeni bir özellik geliştirirken:

1. **Container'ları başlat**
   ```bash
   docker-compose start
   ```

2. **Database değişikliği varsa migration oluştur**
   ```bash
   docker-compose exec app npx prisma migrate dev --name yeni_ozellik
   ```

3. **Hot reload aktif** - kod değişiklikleri otomatik yansır

4. **İş bittiğinde durdur** (opsiyonel)
   ```bash
   docker-compose stop
   ```

### Production'a deploy öncesi:

```bash
# Build kontrolü
docker-compose exec app npm run build

# Lint kontrolü
docker-compose exec app npm run lint

# TypeScript kontrolü
docker-compose exec app npx tsc --noEmit
```

## 🔄 Versiyon Güncellemeleri

### Node.js/NPM paketlerini güncelle
```bash
# Package.json'ı güncelle
docker-compose exec app npm update

# Veya belirli bir paketi güncelle
docker-compose exec app npm install paket_adi@latest

# Container'ı yeniden build et
docker-compose up -d --build
```

### Docker image'larını güncelle
```bash
# En son image'ları çek
docker-compose pull

# Container'ları yeniden oluştur
docker-compose up -d --build
```

## 💡 İpuçları

1. **Development sırasında**: `docker-compose logs -f app` ile logları takip et
2. **Database değişikliklerini test et**: Önce dev ortamında migration oluştur
3. **Volume backup**: Önemli data varsa düzenli backup al
4. **Resource kullanımı**: `docker stats` ile container kaynak kullanımını izle
5. **Container temizliği**: Kullanılmayan image'lar için `docker system prune`

## 📞 Yardım ve Destek

Sorun yaşarsan:
1. Bu dökümanı kontrol et
2. `docker-compose logs` ile hata mesajlarını incele
3. Container durumunu `docker-compose ps` ile kontrol et
4. Gerekirse container'ları yeniden başlat: `docker-compose restart`

---

**Son Güncelleme**: 17 Ocak 2026
**Docker Version**: 28.5.1
**Docker Compose Version**: İçeride mevcut

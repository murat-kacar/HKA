# HKA - Halk Kültürü Akademisi

Next.js 16, Prisma, PostgreSQL ve Docker ile geliştirilmiş modern web uygulaması.

## 🚀 Hızlı Başlangıç

### Docker ile (Önerilen)

```bash
# 1. Environment dosyasını oluştur
cp .env.example .env

# 2. Docker container'ları başlat
docker-compose up -d

# 3. Migration'ları uygula
docker-compose exec app npx prisma migrate deploy

# 4. Uygulamayı aç
# http://localhost:3000
```

**Detaylı bilgi için**: [DOCKER_SETUP.md](./DOCKER_SETUP.md) dosyasını inceleyin.

### Manuel Kurulum

```bash
# 1. Bağımlılıkları kur
npm install

# 2. Environment dosyasını oluştur
cp .env.example .env
# DATABASE_URL'i kendi PostgreSQL sunucunuza göre düzenleyin

# 3. Prisma migration'larını çalıştır
npx prisma migrate deploy

# 4. Development server'ı başlat
npm run dev
```

Uygulamayı [http://localhost:3000](http://localhost:3000) adresinde açın.

## 📁 Proje Yapısı

```
app/
├── (public)/          # Public sayfalar (anasayfa, eğitimler, vb.)
├── admin/             # Admin panel
├── components/        # Reusable React components
├── actions/           # Server actions
└── lib/              # Utility fonksiyonlar

prisma/
├── schema.prisma      # Database schema
├── migrations/        # Database migration'ları
└── seed.ts           # Seed data

docker-compose.yml     # Docker servis tanımları
Dockerfile            # App container yapılandırması
```

## 🛠️ Teknoloji Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL 18
- **ORM**: Prisma 5
- **Styling**: Tailwind CSS 4
- **Editor**: Tiptap (Rich Text Editor)
- **Media**: Sharp (Image Processing)
- **Container**: Docker & Docker Compose

## 📚 Dökümanlar

- [Docker Kurulum ve Kullanım Rehberi](./DOCKER_SETUP.md) - Detaylı Docker komutları ve workflow
- [.env.example](./.env.example) - Environment değişkenleri şablonu

## 🔗 Faydalı Linkler

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

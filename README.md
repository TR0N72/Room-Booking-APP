# 🏢 Room Booking System - PWA

> **Progressive Web App untuk Sistem Peminjaman Ruangan**
>
> Build dengan Next.js, TypeScript, Tailwind CSS, dan Supabase

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Overview

Aplikasi PWA lengkap untuk manajemen peminjaman ruangan dengan fitur:

- 👥 **User System**: Register, login, profile management
- 🏠 **Room Management**: Browse, search, detail view
- 📅 **Booking System**: Create, track, approval workflow
- 🔐 **Admin Panel**: Room CRUD, booking approval/rejection
- 🎫 **Token System**: Auto-generated token dengan auto-expiration
- 📱 **PWA Support**: Offline access, installable, responsive
- 🚀 **Production Ready**: Vercel deployment, environment management

---

## 🚀 Quick Start (5 Menit)

### 1. Clone / Download Project

```bash
# Via Git (if repo exists)
git clone <repo-url>
cd room-booking-app

# OR: Extract dari file
# Paste file ke folder Anda
cd room-booking-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dengan Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Setup Supabase Database

- Go ke `QUICK-START.md` → Section "Setup Database"
- Copy SQL queries
- Paste di Supabase SQL Editor
- Run semua queries

### 5. Run Locally

```bash
npm run dev
# Buka http://localhost:3000
```

### ⚠️ Mock Mode (Offline/No-Database)
Jika file `.env.local` tidak ada, aplikasi otomatis masuk **Mock Mode**:
- **Login Bypass**: Masuk dengan email/password bebas.
- **Role**: Otomatis login sebagai **Admin**.
- **Data**: Menggunakan data dummy (RBC, Ruang Hima).
- **Fitur**: Bisa create booking, approve, dan lihat calendar.

### 6. Test Features

- Register akun baru
- Login
- Browse rooms
- Create booking
- (Admin) Approve booking & lihat token

### 7. Deploy ke Vercel

- Follow `DEPLOYMENT-GUIDE.md` untuk deployment step-by-step

---

## 📚 Documentation

Baca dokumentasi sesuai kebutuhan Anda:

| Document                                           | Untuk                            | Waktu     |
| -------------------------------------------------- | -------------------------------- | --------- |
| [**QUICK-START.md**](./QUICK-START.md)             | Setup cepat & testing lokal      | 5 min     |
| [**README-SETUP.md**](./README-SETUP.md)           | Setup mendalam & database schema | 20 min    |
| [**DEPLOYMENT-GUIDE.md**](./DEPLOYMENT-GUIDE.md)   | Deploy ke Vercel & GitHub        | 15 min    |
| [**API-DOCUMENTATION.md**](./API-DOCUMENTATION.md) | API reference & code examples    | 10 min    |
| [**TROUBLESHOOTING.md**](./TROUBLESHOOTING.md)     | Fix common issues                | As needed |
| [**PROJECT-SUMMARY.md**](./PROJECT-SUMMARY.md)     | Project overview & tech stack    | 5 min     |
| [**FINAL-CHECKLIST.md**](./FINAL-CHECKLIST.md)     | Pre-deployment verification      | 5 min     |

---

## 🎯 Key Features

### 👥 User Features

- ✅ **Autentikasi**: Register, login, logout dengan Supabase
- ✅ **Dashboard**: Statistik peminjaman, recent bookings
- ✅ **Browse Rooms**: Search, filter, detail view
- ✅ **Booking**: Create dengan dropdown date/time (no popups)
- ✅ **History**: Track semua bookings dengan status
- ✅ **Token**: View token saat booking approved
- ✅ **Profile**: Edit profil, lihat informasi app

### 🔐 Admin Features

- ✅ **Admin Dashboard**: Statistik rooms & bookings
- ✅ **Room Management**: Add, edit, delete rooms
- ✅ **Booking Approval**: Approve/reject dengan auto-token generation
- ✅ **Token Management**: Lihat token expiration
- ✅ **Booking List**: Pending & approved bookings

### 📱 PWA Features

- ✅ **Installable**: Add to home screen (mobile & desktop)
- ✅ **Offline Support**: Cached pages berfungsi offline
- ✅ **Responsive**: Mobile-first design
- ✅ **Fast**: Service worker caching
- ✅ **Bottom Nav**: Navigation always visible

---

## 🛠 Tech Stack

```
Frontend:
  - Next.js 16 (React 19, TypeScript)
  - Tailwind CSS (responsive styling)
  - Sonner (toast notifications)

Backend:
  - Supabase (PostgreSQL)
  - Supabase Auth
  - Row Level Security (RLS)

PWA:
  - Service Worker
  - Web Manifest
  - next-pwa

Deployment:
  - Vercel
  - GitHub
```

---

## 📁 Project Structure

```
room-booking-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Auth pages (login, register)
│   │   ├── dashboard/         # User dashboard
│   │   ├── rooms/             # Rooms listing & details
│   │   ├── bookings/          # Bookings management
│   │   ├── profile/           # User profile
│   │   └── admin/             # Admin panel
│   ├── components/            # Reusable components
│   │   ├── common/            # Shared components
│   │   ├── RoomCard.tsx       # Room display
│   │   └── BookingCard.tsx    # Booking display
│   ├── services/              # API services
│   │   ├── auth.ts
│   │   ├── rooms.ts
│   │   └── bookings.ts
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/                 # TypeScript types
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons
├── .env.local                 # Environment variables (EDIT THIS)
├── .env.example               # Env template
├── vercel.json                # Vercel config
├── next.config.js             # Next.js config
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Schema

### Users Table

```sql
id, email, full_name, role (user|admin), created_at, updated_at
```

### Rooms Table

```sql
id, name, description, capacity, location, price_per_hour, image_url, created_at, updated_at
```

### Bookings Table

```sql
id, user_id, room_id, start_date, end_date, start_time, end_time,
status (pending|approved|rejected|completed), token, token_expires_at,
notes, created_at, updated_at
```

**Security**: Row Level Security (RLS) policies protect data access

---

## 🔑 API Services

### Auth Service

```typescript
authService.register(email, password, fullName);
authService.login(email, password);
authService.logout();
authService.getCurrentUser();
authService.getUserProfile(userId);
```

### Rooms Service

```typescript
roomService.getAllRooms();
roomService.getRoomById(id);
roomService.createRoom(room); // Admin only
roomService.updateRoom(id, room); // Admin only
roomService.deleteRoom(id); // Admin only
```

### Bookings Service

```typescript
bookingService.createBooking(booking);
bookingService.getBookingsByUserId(userId);
bookingService.getAllBookings(); // Admin only
bookingService.getBookingById(id);
bookingService.approveBooking(id, expiresAt); // Admin only + token
bookingService.rejectBooking(id); // Admin only
bookingService.getUnavailableSlots(roomId, date);
```

Lihat [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) untuk detail lengkap.

---

## 🚀 Deployment

### Deploy ke Vercel (5 menit)

1. **Push ke GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import ke Vercel**

   - Go ke https://vercel.com/new
   - Select GitHub repo
   - Set environment variables
   - Click Deploy

3. **Update Supabase Settings**

   - Add Vercel domain ke Supabase redirect URLs

4. **Done!**
   - Access app di Vercel URL

Lihat [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) untuk detail lengkap.

---

## 🧪 Development

### Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run production server
npm start

# TypeScript check
npm run type-check

# Format code
npm run format
```

### Development Workflow

1. Create branch: `git checkout -b feature/name`
2. Make changes
3. Commit: `git commit -m "Description"`
4. Push: `git push origin feature/name`
5. Vercel auto-previews changes
6. Merge ke main setelah review

---

## 🐛 Troubleshooting

Common issues dan solusi:

| Issue                      | Solution                      |
| -------------------------- | ----------------------------- |
| Build failed               | Check `npm run build` locally |
| Supabase connection failed | Verify `.env.local` variables |
| Login not working          | Check Supabase auth setup     |
| Room not displaying        | Check database, verify RLS    |
| PWA not installing         | Hard refresh: Ctrl+Shift+R    |

Lihat [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) untuk 27+ issues.

---

## 🎓 Learning

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 📊 Project Statistics

- **Lines of Code**: 5000+
- **Pages**: 13 routes
- **Components**: 7 reusable
- **Services**: 3 services
- **Database Tables**: 4 tables
- **API Methods**: 20+ methods
- **Documentation**: 7 files
- **Build Status**: ✅ Passing

---

## ✅ Pre-Launch Checklist

- [x] All pages accessible
- [x] Authentication works
- [x] Room management functional
- [x] Booking workflow complete
- [x] Token system working
- [x] Admin features tested
- [x] PWA installable
- [x] Responsive design
- [x] Build successful
- [x] Documentation complete

Ready untuk production! 🚀

---

## 📞 Support

### Getting Help

1. **Check Documentation**

   - QUICK-START.md untuk setup cepat
   - TROUBLESHOOTING.md untuk common issues
   - API-DOCUMENTATION.md untuk API reference

2. **Check Browser Console**

   - F12 → Console → lihat error messages
   - F12 → Network → check requests

3. **Check Supabase Logs**

   - Supabase Dashboard → Database → SQL Editor → Telemetry

4. **Check Build Logs**
   - Local: `npm run build` output
   - Vercel: Dashboard → Deployments → Build logs

---

## 📄 License

MIT License - Feel free to use untuk personal atau commercial projects.

---

## 🎉 Selamat!

Aplikasi Anda sudah **Production Ready**!

### Next Steps:

1. ✅ Setup Supabase (lihat QUICK-START.md)
2. ✅ Test locally (npm run dev)
3. ✅ Deploy to Vercel (lihat DEPLOYMENT-GUIDE.md)
4. ✅ Share dengan users!

---

## 📝 Recent Updates

- ✅ Complete PWA support
- ✅ Admin panel dengan token system
- ✅ Comprehensive documentation
- ✅ Deployment ready
- ✅ Build passing all checks

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**

**Last Updated**: December 1, 2025

---

## 🎯 Roadmap (Future)

- [ ] Email notifications
- [x] Calendar view
- [ ] User reviews/ratings
- [ ] Payment integration
- [ ] Recurring bookings
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode

---

## 👨‍💻 Developer Notes

Untuk custom development:

1. Baca API-DOCUMENTATION.md untuk understand services
2. Edit pages di `src/app/` untuk UI changes
3. Edit services di `src/services/` untuk business logic
4. Edit components di `src/components/` untuk reusable parts
5. Database changes di Supabase SQL Editor

---

**Happy Building! 🚀**

# 🚀 QUICK START GUIDE - Room Booking PWA

## ⚡ Setup Dalam 5 Menit

### Step 1: Setup Environment Variables

```bash
# Copy .env.example dan edit dengan Supabase credentials
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Dapatkan dari: https://app.supabase.com → Settings → API

### Option B: Mock Mode (Tanpa Supabase) -> SUPER CEPAT ⚡
Jika Anda **tidak** membuat file `.env.local`, aplikasi otomatis berjalan di **Mock Mode**:
- **Bypass Login**: Masuk dengan email/password apapun.
- **Admin Access**: Otomatis jadi admin.
- **Data Dummy**: Ruangan dan booking sudah tersedia secara lokal.
- **Cocok untuk**: Testing UI dan flow aplikasi tanpa setup backend.

### Step 2: Setup Database (via Supabase SQL Editor)

**Paste dan jalankan:**

```sql
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text NOT NULL UNIQUE,
  full_name text,
  role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  capacity integer NOT NULL,
  location text NOT NULL,
  price_per_hour integer DEFAULT 0,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id),
  room_id uuid NOT NULL REFERENCES public.rooms(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  status text DEFAULT 'pending',
  token text UNIQUE,
  token_expires_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Step 3: Run Development Server

```bash
npm run dev
```

Akses: http://localhost:3000

### Step 4: Test Flow

1. **Register** dengan email apapun
2. **Login** dengan email yang sama
3. Browse **Rooms** → klik room
4. **Book Now** → pilih date/time dari dropdown
5. **Submit** → booking created

### Step 5: Promote to Admin (Optional)

```sql
-- Di Supabase SQL Editor:
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Maka:

- Admin Panel muncul di navigation
- Bisa manage rooms dan approve bookings

---

## 📱 PWA Installation

### Desktop (Chrome):

Address bar → Install app

### Mobile (Android):

Menu → Install app

### iOS (Safari):

Share → Add to Home Screen

---

## 🔑 Key Features

- ✅ Date/time picker using **dropdowns** (not popup)
- ✅ Unavailable slots auto-detected
- ✅ Auto token generation saat approved
- ✅ Rejected bookings disappear dari admin
- ✅ Offline support
- ✅ Mobile-friendly

---

## 📝 Demo Flow

### User Side:

1. Register/Login
2. Browse rooms dengan search
3. Klik room → see details
4. Book → select date/time dari dropdown
5. Submit → waiting for approval
6. Admin approves → token generated
7. View token di booking detail

### Admin Side:

1. Go to Admin panel (tombol di bottom nav)
2. Click "Manage Rooms" → Add/Edit/Delete
3. Click "Manage Bookings" → Approve/Reject pending
4. Rejected bookings: disappear dari list
5. Approved bookings: token visible

---

## 🐛 Common Issues

| Issue                      | Solution                      |
| -------------------------- | ----------------------------- |
| Supabase error             | Check `.env.local` is correct |
| Build error                | Run `npm install` again       |
| Service Worker not working | Clear cache, reload page      |
| Can't submit booking       | Check date/time is selected   |

---

## 📚 Full Documentation

See: `README-SETUP.md` untuk detailed setup termasuk RLS policies, auth trigger, dan deployment instructions.

---

## 🚀 Deploy ke Vercel (5 Menit)

1. Push ke GitHub
2. Go to https://vercel.com
3. Import project
4. Set env variables (SUPABASE_URL, ANON_KEY)
5. Deploy

✅ Done! Aplikasi live di Vercel.

---

## 💡 Next Steps

1. ✅ Basic setup → selesai
2. Customize branding (logo, colors)
3. Add more rooms
4. Test dengan multiple users
5. Deploy to production

---

**Happy Booking! 🎉**

# MysticIsle E-commerce Platform

A modern e-commerce platform for rave and festival fashion, built with Next.js, Supabase, and Tailwind CSS.

## 🌟 Features

- 🛍️ Product catalog with multiple categories
- 🖼️ Image carousel for product photos
- 🌐 Multi-language support (English & Chinese)
- 📱 Responsive design
- 🔐 Admin dashboard for product management
- 🎨 Modern UI with Tailwind CSS
- 💾 Supabase backend (PostgreSQL + Storage)

## 🚀 Tech Stack

- **Frontend**: Next.js 15.5.4 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Custom admin authentication
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/JoreyYan/mysticlsle.git
cd mysticlsle/frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=MysticIsle
```

4. **Set up the database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `/database/schema.sql`
   - Go to Storage
   - Create a new bucket named `product-images`
   - Set the bucket to **Public**
   - Run the storage policies from the schema

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) to see the website.

### 🔑 Admin Access

Default admin credentials:
- **Email**: `admin@mysticisle.com`
- **Password**: `admin123`

Access admin dashboard at: http://localhost:5000/admin/login

⚠️ **Important**: Change the default password after first login!

## 🌐 Deployment on Vercel

### Step 1: Connect to GitHub

If you haven't already, initialize git and push to your repository:

```bash
cd D:\code\missale
git init
git add .
git commit -m "Initial commit: MysticIsle E-commerce Platform"
git branch -M main
git remote add origin https://github.com/JoreyYan/mysticlsle.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select `mysticlsle` from your GitHub repositories
5. Configure project settings:

   **Framework Preset**: Next.js

   **Root Directory**: `frontend`

   **Build Command**: `npm run build`

   **Output Directory**: `.next`

   **Install Command**: `npm install`

6. **Add Environment Variables**:
   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |
   | `NEXT_PUBLIC_APP_NAME` | `MysticIsle` |

7. Click **"Deploy"**

### Step 3: Configure Supabase for Production

After deployment:

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Add your Vercel domain to **Site URL**
4. Navigate to **Authentication** → **URL Configuration**
5. Add your Vercel URL to **Redirect URLs**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── dashboard/     # Main admin dashboard
│   │   │   ├── products/      # Product management
│   │   │   └── login/         # Admin login
│   │   ├── collections/       # Product collection pages
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Header.tsx        # Site header
│   │   ├── Footer.tsx        # Site footer
│   │   ├── ProductCard.tsx   # Product card with carousel
│   │   ├── FilterSidebar.tsx # Product filters
│   │   └── ImageUpload.tsx   # Image upload component
│   ├── contexts/             # React contexts
│   │   └── LanguageContext.tsx
│   ├── lib/                  # Utilities and configs
│   │   ├── supabase.ts      # Supabase client
│   │   └── i18n.ts          # Internationalization
│   └── types/                # TypeScript types
│       └── database.ts
├── public/                    # Static files
├── database/                  # Database schema
│   └── schema.sql
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## ✨ Key Features

### Admin Dashboard
- ✅ Product management (create, edit, delete)
- ✅ Image upload with Supabase Storage
- ✅ Multi-image support with primary image selection
- ✅ Image reordering (drag and drop alternative)
- ✅ Category management
- ✅ Product activation/deactivation
- ✅ Real-time product search and filtering
- ✅ Multi-language admin interface

### Frontend
- ✅ Product catalog with category filtering
- ✅ Image carousel on product cards (hover to navigate)
- ✅ Multi-language support (EN/CN)
- ✅ Responsive design for all devices
- ✅ Category-based navigation
- ✅ Product filtering by color, size, type, stock
- ✅ Image preloading for smooth transitions

## 🌍 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes | `https://your-domain.com` |
| `NEXT_PUBLIC_APP_NAME` | Application name | Yes | `MysticIsle` |

## 🐛 Troubleshooting

### Images not loading
- ✅ Check if the Storage bucket `product-images` is created and set to **public**
- ✅ Verify Storage policies are correctly set up (see `database/schema.sql`)
- ✅ Check if image URLs are correct in the database `product_images` table
- ✅ Make sure images are uploaded through the admin dashboard

### Build errors on Vercel
- ✅ Make sure all environment variables are set in Vercel project settings
- ✅ Check that the root directory is set to `frontend`
- ✅ Verify Node.js version compatibility (18+)
- ✅ Check build logs for specific errors

### Database connection issues
- ✅ Verify Supabase URL and anon key are correct
- ✅ Check if RLS (Row Level Security) policies are properly set
- ✅ Make sure database tables are created from schema.sql

## 📝 Common Tasks

### Adding a new product
1. Log in to admin dashboard
2. Go to "Upload Products"
3. Fill in product details
4. Upload multiple images
5. Select primary image
6. Set as "Active" to display on frontend

### Managing categories
1. Run SQL to insert categories (see `database/schema.sql`)
2. Or use Supabase Table Editor directly

### Updating translations
Edit `src/lib/i18n.ts` to add or modify translations

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/JoreyYan/mysticlsle/issues)
- Check existing issues for solutions

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

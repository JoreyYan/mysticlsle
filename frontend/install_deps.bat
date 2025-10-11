@echo off
echo Installing ChillFitRave dependencies...

npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand immer
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install react-hook-form @hookform/resolvers zod
npm install @radix-ui/react-slot

echo Dependencies installed successfully!
echo You can now run: npm run dev

pause
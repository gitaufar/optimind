# Storage Troubleshooting Guide

## Error: "new row violates row-level security policy"

### Solusi 1: Jalankan Script SQL (Recommended)

1. Buka **Supabase Dashboard** > **SQL Editor**
2. Jalankan script berikut:

```sql
-- Simple fix for pdf_storage bucket RLS issues
-- Run this in Supabase SQL Editor

-- 1. Ensure bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf_storage',
  'pdf_storage', 
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'image/bmp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop all existing policies for storage.objects
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON storage.objects';
    END LOOP;
END $$;

-- 3. Create simple, permissive policies
CREATE POLICY "pdf_storage_all_access" ON storage.objects
FOR ALL USING (bucket_id = 'pdf_storage');

-- 4. Verify the bucket is accessible
SELECT * FROM storage.buckets WHERE id = 'pdf_storage';
```

### Solusi 2: Manual Setup di Dashboard

1. **Buat Bucket:**
   - Buka **Storage** di Supabase Dashboard
   - Klik **"New bucket"**
   - Nama: `pdf_storage`
   - Public: ✅ (centang)
   - File size limit: 10MB

2. **Atur RLS Policies:**
   - Buka **Authentication** > **Policies**
   - Cari tabel `storage.objects`
   - Hapus semua policy yang ada
   - Buat policy baru:
     - Name: `pdf_storage_access`
     - Operation: `ALL`
     - Target roles: `authenticated, anon`
     - USING expression: `bucket_id = 'pdf_storage'`

### Solusi 3: Disable RLS (Development Only)

⚠️ **HATI-HATI: Hanya untuk development!**

```sql
-- Disable RLS for storage.objects (temporary)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

### Verifikasi

Setelah menjalankan salah satu solusi di atas:

1. Buka **Storage** di Supabase Dashboard
2. Pastikan bucket `pdf_storage` ada
3. Coba upload file PDF di aplikasi
4. Periksa console browser - tidak ada error lagi

### Troubleshooting

- **Masih error?** Cek apakah user sudah login
- **Bucket tidak muncul?** Refresh halaman Supabase Dashboard
- **File tidak ter-upload?** Periksa network tab di browser dev tools

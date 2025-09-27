# 🚀 Deployment Guide untuk VPS IDCloudHost

Panduan deployment iFEST di VPS IDCloudHost dengan budget 100k.

## 📋 Prerequisites VPS

### Spesifikasi Minimum
- **RAM**: 1-2 GB (cukup untuk aplikasi ini)
- **CPU**: 1-2 vCPU
- **Storage**: 20 GB+ SSD
- **OS**: Ubuntu 20.04+ / CentOS 7+

## 🔧 Setup VPS

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git nginx supervisor

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Tesseract OCR untuk PDF processing
sudo apt install -y tesseract-ocr tesseract-ocr-ind libtesseract-dev

# Install additional libraries untuk PDF
sudo apt install -y poppler-utils libgl1-mesa-glx
```

### 2. Clone dan Setup Project

```bash
# Clone project
cd /var/www
sudo git clone https://github.com/gitaufar/optimind.git ifest
sudo chown -R $USER:$USER /var/www/ifest
cd /var/www/ifest
```

### 3. Backend Setup

```bash
cd /var/www/ifest/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install additional production dependencies
pip install gunicorn python-dotenv

# Create .env file
sudo nano .env
```

**Backend .env file:**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key

# Production Settings
APP_ENV=production
DEBUG=False
HOST=0.0.0.0
PORT=8000
UPLOAD_FOLDER=/var/www/ifest/backend/data/uploads
OUTPUT_FOLDER=/var/www/ifest/backend/data/outputs
```

```bash
# Create directories
mkdir -p data/uploads data/outputs logs

# Test backend
gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 4. Frontend Setup

```bash
cd /var/www/ifest/frontend

# Install dependencies
npm ci --production

# Create .env file
nano .env
```

**Frontend .env file:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration (gunakan domain VPS atau IP)
VITE_API_BASE_URL=https://your-domain.com/api
# atau jika menggunakan IP:
# VITE_API_BASE_URL=http://your-vps-ip/api
```

```bash
# Build production
npm run build

# Copy build ke web directory
sudo cp -r dist/* /var/www/html/
```

### 5. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/ifest
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name your-domain.com your-vps-ip;
    
    # Frontend (React app)
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle large file uploads
        client_max_body_size 100M;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ifest /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test dan restart nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 6. Process Management dengan Supervisor

```bash
sudo nano /etc/supervisor/conf.d/ifest.conf
```

**Supervisor config:**
```ini
[program:ifest-backend]
command=/var/www/ifest/backend/venv/bin/gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
directory=/var/www/ifest/backend
user=www-data
autostart=true
autorestart=true
startsecs=3
redirect_stderr=true
stdout_logfile=/var/log/supervisor/ifest-backend.log
stdout_logfile_maxbytes=50MB
stdout_logfile_backups=5
environment=PATH="/var/www/ifest/backend/venv/bin"
```

```bash
# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start ifest-backend
sudo supervisorctl status
```

### 7. SSL Certificate (Optional tapi Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto renewal
sudo systemctl enable certbot.timer
```

## 🔧 Optimizations untuk VPS 100k

### Memory Optimization
```bash
# Limit Gunicorn workers (2 workers cukup untuk VPS 1-2GB)
# Di supervisor config: -w 2

# Enable gzip di Nginx
sudo nano /etc/nginx/nginx.conf
```

**Tambahkan di nginx.conf:**
```nginx
# Gzip Settings
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Storage Optimization
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/ifest
```

**Logrotate config:**
```
/var/log/supervisor/ifest-*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 644 www-data www-data
}

/var/www/ifest/backend/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 644 www-data www-data
}
```

## 🚀 Deployment Commands

```bash
# Deploy script
#!/bin/bash
cd /var/www/ifest

# Pull latest changes
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Update frontend
cd ../frontend
npm ci --production
npm run build
sudo cp -r dist/* /var/www/html/

# Restart services
sudo supervisorctl restart ifest-backend
sudo systemctl reload nginx

echo "Deployment completed!"
```

## 📊 Resource Monitoring

```bash
# Check system resources
htop
df -h
free -h

# Check application logs
sudo tail -f /var/log/supervisor/ifest-backend.log
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check application status
sudo supervisorctl status
sudo systemctl status nginx
```

## 🐛 Troubleshooting VPS

### Common Issues

1. **Memory Issues**
   ```bash
   # Add swap space
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **Permission Issues**
   ```bash
   sudo chown -R www-data:www-data /var/www/ifest/backend/data
   sudo chmod -R 755 /var/www/ifest/backend/data
   ```

3. **OCR Issues**
   ```bash
   # Install additional language packs
   sudo apt install -y tesseract-ocr-eng tesseract-ocr-ind
   
   # Test OCR
   cd /var/www/ifest/backend
   source venv/bin/activate
   python -c "import pytesseract; print(pytesseract.get_tesseract_version())"
   ```

## 💡 Tips VPS 100k

1. **Use PM2 Alternative**: Supervisor lebih lightweight dari PM2
2. **Optimize Images**: Compress assets sebelum upload
3. **Enable Caching**: Nginx caching untuk static files
4. **Monitor Resource**: Setup basic monitoring
5. **Backup Strategy**: Setup auto backup ke cloud storage

## 🔄 Auto Deployment (Optional)

Setup webhook untuk auto-deploy dari GitHub:

```bash
# Install webhook
sudo apt install -y webhook

# Create webhook script
sudo nano /opt/deploy-ifest.sh
```

**Deploy script:**
```bash
#!/bin/bash
cd /var/www/ifest
git pull origin main

# Restart services
cd backend
source venv/bin/activate
pip install -r requirements.txt

cd ../frontend  
npm ci --production
npm run build
sudo cp -r dist/* /var/www/html/

sudo supervisorctl restart ifest-backend
sudo systemctl reload nginx
```

---

**Kesimpulan**: VPS IDCloudHost 100k **CUKUP** untuk aplikasi ini dengan optimizations yang tepat! 🎯
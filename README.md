# iFEST Hackathon - Optimind

Smart contract management system with AI-powered risk analysis and automated procurement workflows.

## 🚀 Features

- **Contract Management**: Complete contract lifecycle management
- **AI Risk Analysis**: Automated contract risk assessment using AI
- **Role-based Access Control**: Different views for Legal, Management, and Procurement teams
- **Document Processing**: OCR and intelligent document parsing
- **Dashboard Analytics**: Real-time KPIs and contract insights

## 🏗️ Tech Stack

### Backend
- **Python 3.11+** with FastAPI
- **Supabase** for database and authentication
- **Groq API** for AI processing
- **PyPDF2** for document processing
- **Tesseract OCR** for text extraction

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.19+ or 22.12+)
- **Python** (version 3.11+)
- **npm** or **yarn**
- **Git**

## 🛠️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/gitaufar/optimind.git
cd optimind
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Environment Configuration
Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual credentials:

```env
# AI/ML API Keys (REQUIRED)
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_TOKEN=your_huggingface_token_here
OPENAI_API_KEY=your_openai_api_key_here

# Security Settings (IMPORTANT: Change in production!)
SECRET_KEY=your_very_secure_random_secret_key_here

# Database Settings
DATABASE_URL=sqlite:///./contracts.db

# Application Settings
APP_ENV=development
DEBUG=True
HOST=0.0.0.0
PORT=8000

# File Upload Settings
UPLOAD_DIR=./data/uploads
MAX_FILE_SIZE=10485760

# CORS Settings (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**⚠️ Security Note**: Never commit the `.env` file to version control. Always use `.env.example` as a template.

#### 2.5 Database Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL scripts in `frontend/supabase/` directory:
   ```sql
   -- Execute these files in order:
   1. complete_schema.sql
   2. contracts.sql
   3. contract_extractions.sql
   4. procurement_kpi.sql
   5. auth_roles.sql
   6. create_pdf_storage_bucket.sql
   7. seed.sql
   ```

#### 2.6 Start Backend Server
```bash
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Environment Configuration
Create a `.env` file in the `frontend` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

#### 3.4 Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Development Commands

### Backend Commands
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Start development server
python main.py

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📁 Project Structure

```
ifest/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── config/
│   │   └── settings.py        # Application configuration
│   ├── models/                # Data models
│   │   ├── contract.py
│   │   └── risk.py
│   ├── routes/                # API endpoints
│   │   ├── analyze.py
│   │   ├── lifecycle.py
│   │   └── risk.py
│   ├── services/              # Business logic
│   │   ├── groq_services.py
│   │   ├── ocr_services.py
│   │   └── risk_services.py
│   └── utils/                 # Utilities
│       ├── pdf_parser.py
│       └── preprocess.py
├── frontend/
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── routes/            # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── legal/         # Legal team pages
│   │   │   ├── management/    # Management pages
│   │   │   └── procurement/   # Procurement pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   └── supabase/              # Database schema and migrations
└── README.md
```

## 🔑 Authentication & Authorization

The system supports role-based access control with three main roles:

### User Roles
- **Legal**: Can view and review submitted contracts
- **Management**: Can view reviewed contracts and analytics
- **Procurement**: Can upload and manage contract submissions

### Default Test Users
After running the seed script, you can use these test accounts:

```
Legal User:
- Email: admin@gmail.com
- Password: admin123

Management User:
- Email: andikger@gmail.com
- Password: 12345678

Procurement User:
- Email: adnika@gmail..com
- Password: 12345678
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using a web server like Nginx or deploy to services like Vercel, Netlify.

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
1. **Import Error**: Make sure virtual environment is activated
2. **Database Connection**: Verify Supabase credentials in `.env`
3. **Port Already in Use**: Change port in `main.py` or kill existing process

#### Frontend Issues
1. **Node Version**: Ensure Node.js version is 20.19+ or 22.12+
2. **Build Errors**: Run `npm run type-check` to identify TypeScript issues
3. **API Connection**: Verify backend is running and `VITE_API_BASE_URL` is correct

### Logs and Debugging
- Backend logs: Check console output or `logs/` directory
- Frontend logs: Open browser developer console
- Database logs: Check Supabase dashboard

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact:
- Email: zhafiraufar123@gmail.com
- GitHub Issues: [Create an issue](https://github.com/gitaufar/optimind/issues)

---

Made with ❤️ by the ZAS Team

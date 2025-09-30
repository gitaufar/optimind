"""
Configuration settings for ILCS Contract AI API
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, validator


class Settings(BaseSettings):
    """Application settings"""
    
    # Application settings
    APP_NAME: str = "ILCS Contract AI API"
    VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False, description="Debug mode")
    APP_ENV: str = Field(default="development", description="Application environment")
    
    # Server settings
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")
    
    # CORS settings
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:3000,http://localhost:5173",
        description="Allowed CORS origins (comma-separated)"
    )
    
    @validator('ALLOWED_ORIGINS', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    # Database settings (for future use)
    DATABASE_URL: str = Field(
        default="sqlite:///./contracts.db",
        description="Database connection URL"
    )
    
    # AI/ML Model settings
    HUGGINGFACE_API_TOKEN: str = Field(default="", description="HuggingFace API token")
    OPENAI_API_KEY: str = Field(default="", description="OpenAI API key")
    GROQ_API_KEY: str = Field(default="", description="Groq API key for fast inference")
    
    # File upload settings
    MAX_FILE_SIZE: int = Field(default=10 * 1024 * 1024, description="Max file size in bytes (10MB)")
    ALLOWED_FILE_TYPES: List[str] = Field(
        default=[".pdf", ".docx", ".doc", ".txt", ".jpg", ".jpeg", ".png"],
        description="Allowed file types for upload"
    )
    UPLOAD_DIR: str = Field(default="./data/uploads", description="Upload directory")
    
    # OCR settings
    TESSERACT_CMD: str = Field(
        default="tesseract",
        description="Tesseract command path"
    )
    
    # Translation settings
    TRANSLATION_MODEL: str = Field(
        default="Helsinki-NLP/opus-mt-en-id",
        description="Translation model for EN to ID"
    )
    
    # Groq model settings
    GROQ_MODEL: str = Field(
        default="llama-3.1-8b-instant",
        description="Groq model for text analysis"
    )
    GROQ_MAX_TOKENS: int = Field(default=1024, description="Max tokens for Groq responses")
    GROQ_TEMPERATURE: float = Field(default=0.1, description="Temperature for Groq model")
    
    # Contract analysis settings
    CONTRACT_TEMPLATES_DIR: str = Field(
        default="./data/templates",
        description="Contract templates directory"
    )
    CLAUSES_DATA_PATH: str = Field(
        default="./data/master_clauses_clean.csv",
        description="Path to clauses dataset"
    )
    
    # Logging settings
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    LOG_FILE: str = Field(default="./logs/app.log", description="Log file path")
    
    # Security settings
    SECRET_KEY: str = Field(
        default="development-secret-key-change-in-production",
        description="Secret key for JWT and encryption"
    )
    
    # Risk assessment settings
    RISK_THRESHOLD_HIGH: float = Field(default=0.7, description="High risk threshold")
    RISK_THRESHOLD_MEDIUM: float = Field(default=0.4, description="Medium risk threshold")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Create necessary directories
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True)
os.makedirs(settings.CONTRACT_TEMPLATES_DIR, exist_ok=True)

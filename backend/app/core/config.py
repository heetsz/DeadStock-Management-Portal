from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://user:password@localhost:3306/deadstock"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_ORIGINS: str = "http://localhost:3000,http://localhost:3001, https://dead-stock-management-portal-main-ir1g-3h7ozdl1o.vercel.app,https://deadstock-management-portal-main.onrender.com"
    
    class Config:
        env_file = ".env"


settings = Settings()


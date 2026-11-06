from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./dataquest.db"
    SECRET_KEY: str = "change-me-in-production-use-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_EXPIRE_MINUTES: int = 60 * 24
    AI_PROVIDER: str = ""  # ej. openai | ollama | "" = local KB
    AI_API_KEY: str = ""
    AI_MODEL: str = ""
    CORS_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()

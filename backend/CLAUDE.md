# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromptMaster AI is a FastAPI-based backend service for intelligent prompt optimization using Google Gemini API. The system provides user authentication, template management, and prompt optimization services with SQLite database storage.

## Development Commands

### Running the Application
```bash
# Start development server
python -m app

# Alternative using uvicorn directly
uvicorn app.main:app --reload
```

### Testing
```bash
# Run all tests
python -m pytest

# Run tests with verbose output
python -m pytest -v

# Run specific test file
python -m pytest tests/test_specific.py
```

### Database Management
```bash
# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Check migration status
alembic current
```

### Code Quality
```bash
# Format code with ruff
ruff format .

# Check linting
ruff check .

# Fix auto-fixable linting issues
ruff check . --fix
```

## Architecture Overview

### Core Components

1. **FastAPI Application** (`app/main.py`)
   - Main application entry point with CORS middleware
   - Includes all API routers with `/api` prefix
   - Database initialization via lifespan events

2. **Authentication System** (`app/api/auth.py`, `app/dependencies.py`)
   - JWT-based authentication with JTI (JWT ID) for token blacklisting
   - User registration, login, logout with secure password hashing (Argon2)
   - Token blacklist system for secure logout functionality

3. **Prompt Optimization Service** (`app/services/prompt_optimizer.py`)
   - Core business logic for prompt optimization
   - Integrates with Gemini API using templates as system instructions
   - Handles template validation, API calls, and history storage

4. **Template System** (`app/models/template.py`, `app/api/templates.py`)
   - Default templates for different optimization scenarios
   - User-created custom templates with permission controls
   - Template categories: content creation, code generation, problem solving

5. **Database Models** (`app/models/`)
   - SQLModel-based models with SQLite backend
   - Models: User, Template, PromptHistory, TokenBlacklist
   - Alembic for database migrations

### Key Services

- **GeminiClient** (`app/services/gemini_client.py`): Handles Google Gemini API integration
- **PromptOptimizerService**: Orchestrates prompt optimization workflow
- **Security utilities** (`app/utils/security.py`, `app/utils/token.py`): JWT handling and password management

## Environment Configuration

Required environment variables in `.env`:
```env
SECRET_KEY=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=sqlite:///database.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## API Architecture

### Authentication Flow
1. POST `/api/auth/register` - User registration
2. POST `/api/auth/login` - Login with JWT token generation (includes JTI)
3. GET `/api/auth/me` - Get current user info
4. POST `/api/auth/logout` - Logout with token blacklisting

### Prompt Optimization Flow
1. GET `/api/templates` - List available templates
2. POST `/api/prompts/optimize` - Optimize prompt using selected template
3. GET `/api/prompts/history` - View optimization history

### Template Management
- GET/POST/PUT/DELETE `/api/templates` - Full CRUD operations
- Permission-based access (users can only modify their own templates)

## Database Design

### Key Tables
- `users` - User accounts with secure password storage
- `templates` - Optimization templates (default + user-created)
- `prompt_history` - Optimization history records
- `token_blacklist` - JWT blacklist for secure logout

### Migration Strategy
- Uses Alembic for database schema management
- Fallback to SQLModel.metadata.create_all() if Alembic unavailable
- Auto-migration on application startup

## Security Considerations

- JWT tokens include JTI (JWT ID) for secure blacklisting
- Argon2 password hashing
- Token blacklist cleanup for expired tokens
- Permission-based resource access
- CORS configuration for frontend integration

## Testing Strategy

- Pytest with async support (`pytest-asyncio`)
- Test configuration in `pytest.ini`
- Tests should cover: API endpoints, business logic, database operations
- Mock external API calls (Gemini) in tests

## Key Development Patterns

1. **Dependency Injection**: Extensive use of FastAPI's dependency system
2. **Service Layer Pattern**: Business logic separated from API routes
3. **Repository Pattern**: Database operations encapsulated in models
4. **Configuration Management**: Centralized settings with Pydantic
5. **Error Handling**: Structured exception handling with HTTP status codes

## Integration Points

- **Google Gemini API**: Core AI service for prompt optimization
- **Frontend CORS**: Configured for `http://localhost:3000`
- **Database**: SQLite with optional migration to PostgreSQL/MySQL for production
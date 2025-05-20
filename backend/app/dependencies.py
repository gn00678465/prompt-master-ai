from sqlmodel import Session, create_engine, SQLModel

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    """Create the database and tables"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Get session"""
    with Session(engine) as session:
        yield session
        
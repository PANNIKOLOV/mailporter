from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class MigrationStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class MigrationJob(Base):
    __tablename__ = "migration_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    source_email = Column(String(255))
    source_password = Column(String(255))  # In production, encrypt this!
    source_host = Column(String(255))
    
    dest_email = Column(String(255))
    dest_password = Column(String(255))    # In production, encrypt this!
    dest_host = Column(String(255))
    
    status = Column(Enum(MigrationStatus), default=MigrationStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    logs = Column(Text, nullable=True)

    user = relationship("User", backref="migrations")

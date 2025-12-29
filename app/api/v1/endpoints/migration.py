from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.migration import MigrationJob
from app.schemas.migration import MigrationCreate, MigrationResponse
from app.models.user import User
from app.tasks import run_migration_task

router = APIRouter()

@router.post("/", response_model=MigrationResponse)
def create_migration_job(
    migration: MigrationCreate, 
    user_id: int,  # In real app, get from current_user
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_migration = MigrationJob(
        user_id=user_id,
        source_email=migration.source_email,
        source_password=migration.source_password,
        source_host=migration.source_host,
        dest_email=migration.dest_email,
        dest_password=migration.dest_password,
        dest_host=migration.dest_host
    )
    
    db.add(db_migration)
    db.commit()
    db.refresh(db_migration)
    
    # Trigger Celery Task
    run_migration_task.delay(db_migration.id)
    
    return db_migration

@router.get("/{job_id}", response_model=MigrationResponse)
def get_migration_status(job_id: int, db: Session = Depends(get_db)):
    job = db.query(MigrationJob).filter(MigrationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Migration job not found")
    return job

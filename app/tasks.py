from app.core.celery_app import celery_app
from app.services.email_transfer import transfer_emails
from app.core.database import SessionLocal
from app.models.migration import MigrationJob, MigrationStatus
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def run_migration_task(self, migration_id: int):
    db = SessionLocal()
    migration_job = db.query(MigrationJob).filter(MigrationJob.id == migration_id).first()
    
    if not migration_job:
        logger.error(f"Migration job {migration_id} not found.")
        return
    
    try:
        migration_job.status = MigrationStatus.IN_PROGRESS
        db.commit()
        
        source_creds = {
            "email": migration_job.source_email,
            "password": migration_job.source_password,
            "host": migration_job.source_host
        }
        
        dest_creds = {
            "email": migration_job.dest_email,
            "password": migration_job.dest_password,
            "host": migration_job.dest_host
        }
        
        logs = transfer_emails(source_creds, dest_creds)
        
        migration_job.status = MigrationStatus.COMPLETED
        migration_job.logs = logs
        db.commit()
        
    except Exception as e:
        logger.exception(f"Migration {migration_id} failed.")
        migration_job.status = MigrationStatus.FAILED
        migration_job.logs = str(e)
        db.commit()
    finally:
        db.close()

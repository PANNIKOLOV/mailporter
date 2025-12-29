# MailPorter

A Python SaaS application to safely move emails from one account to another using IMAP (for fetching/appending) and Celery for background processing.

## Tech Stack

- **Backend:** FastAPI
- **Background Tasks:** Celery
- **Database:** MariaDB (accessed via SQLAlchemy)
- **Broker:** Redis
- **Email Handling:** imap-tools

## Setup

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and update the values.
   ```bash
   cp .env.example .env
   ```
   Make sure you have a running MariaDB/MySQL instance and a Redis instance.
   Create the database `mailporter` in your MariaDB.

3. **Run the API Server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   Docs at `http://localhost:8000/docs`.

4. **Run the Celery Worker:**
   ```bash
   celery -A app.core.celery_app worker --loglevel=info -P eventlet
   ```
   *Note: On Windows, you might need `eventlet` or `gevent` (install via `pip install eventlet`) and use `-P eventlet`. If on Linux/Mac, default pool is fine.*

## Usage

1. **Create a User:**
   POST `/api/v1/auth/users/`

2. **Start a Migration:**
   POST `/api/v1/migrations/`
   Payload:
   ```json
   {
     "source_email": "user@source.com",
     "source_password": "password",
     "source_host": "imap.source.com",
     "dest_email": "user@dest.com",
     "dest_password": "password",
     "dest_host": "imap.dest.com"
   }
   ```
   Query Param: `user_id=1` (for this baseline).

3. **Check Status:**
   GET `/api/v1/migrations/{id}`

## Notes

- This is a baseline implementation.
- Passwords are currently stored in plain text in the `migration_jobs` table for the duration of the task (and indefinitely in this baseline). **In production, use encryption (e.g., Fernet) to store credentials and clear them after the job is done.**
- Error handling is basic.
- Ensure IMAP access is enabled on both email accounts.

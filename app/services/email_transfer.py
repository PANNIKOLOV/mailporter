from imap_tools import MailBox, A
import logging

logger = logging.getLogger(__name__)

def transfer_emails(source_creds: dict, dest_creds: dict):
    """
    Transfers emails from source account to destination account using IMAP.
    """
    log_messages = []
    
    try:
        # Connect to Source
        with MailBox(source_creds['host']).login(source_creds['email'], source_creds['password']) as source_box:
            # Connect to Destination
            with MailBox(dest_creds['host']).login(dest_creds['email'], dest_creds['password']) as dest_box:
                
                # Select INBOX
                source_box.folder.set('INBOX')
                dest_box.folder.set('INBOX')
                
                # Fetch all messages
                messages = source_box.fetch()
                
                count = 0
                for msg in messages:
                    try:
                        # Append to destination
                        # We append the raw bytes
                        dest_box.append(msg.obj, dt=msg.date)
                        count += 1
                    except Exception as e:
                        error_msg = f"Failed to append message {msg.uid}: {str(e)}"
                        logger.error(error_msg)
                        log_messages.append(error_msg)
                
                success_msg = f"Successfully transferred {count} emails."
                logger.info(success_msg)
                log_messages.append(success_msg)
                
    except Exception as e:
        error_msg = f"Migration failed: {str(e)}"
        logger.error(error_msg)
        log_messages.append(error_msg)
        raise e
        
    return "\n".join(log_messages)

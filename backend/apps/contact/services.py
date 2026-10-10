import html
import logging
import os
import threading
from django.utils import timezone
import requests

logger = logging.getLogger(__name__)


def _send_telegram_worker(
    name: str,
    email: str,
    message: str,
    contact_id: int = None,
    created_at = None,
) -> bool:
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not bot_token or not chat_id:
        logger.warning(
            "Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in backend/.env"
        )
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    safe_name = html.escape(str(name or ""))
    safe_email = html.escape(str(email or ""))
    safe_message = html.escape(str(message or ""))

    # Format timestamp if available
    time_str = ""
    if created_at:
        try:
            local_time = timezone.localtime(created_at) if hasattr(timezone, "localtime") else created_at
            time_str = f"🕒 <b>Received:</b> {local_time.strftime('%d %b %Y, %I:%M %p')}\n"
        except Exception:
            time_str = f"🕒 <b>Received:</b> {str(created_at)}\n"

    id_header = f" (ID: #{contact_id})" if contact_id else ""

    text = (
        f"📬 <b>New Contact Form Submission{id_header}</b>\n\n"
        f"👤 <b>Name:</b> {safe_name}\n"
        f"✉️ <b>Email:</b> {safe_email}\n"
        f"{time_str}\n"
        f"💬 <b>Message:</b>\n{safe_message}"
    )

    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }

    try:
        response = requests.post(url, json=payload, timeout=8)
        data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}

        if not response.ok:
            error_desc = data.get("description", response.text)
            if response.status_code == 403:
                logger.error(
                    "Telegram 403 Forbidden: '%s'. You must open the bot in Telegram (https://t.me/nawaz_test_bot) and press 'Start' (/start) so the bot has permission to message you.",
                    error_desc,
                )
            else:
                logger.error("Telegram API error (%s): %s", response.status_code, error_desc)
            return False

        logger.info("Telegram contact notification sent successfully for contact ID #%s", contact_id)
        return True
    except Exception as exc:
        logger.error("Failed to send Telegram notification: %s", exc)
        return False


def notify_telegram_contact(
    name_or_instance,
    email: str = None,
    message: str = None,
    contact_id: int = None,
    created_at = None,
) -> None:
    """Dispatches Telegram notification in a background thread with SQLite contact record data.
    
    Accepts either a ContactMessage model instance, or individual field values.
    """
    if hasattr(name_or_instance, "name") and hasattr(name_or_instance, "email"):
        instance = name_or_instance
        name = instance.name
        email = instance.email
        message = instance.message
        contact_id = getattr(instance, "id", None)
        created_at = getattr(instance, "created_at", None)
    else:
        name = name_or_instance

    thread = threading.Thread(
        target=_send_telegram_worker,
        args=(name, email, message, contact_id, created_at),
        daemon=True,
    )
    thread.start()

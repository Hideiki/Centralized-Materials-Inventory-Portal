import frappe

def get_context(context):
    user = frappe.session.user
    user_full_name = (
        frappe.get_cached_value("User", user, "full_name")
        or user
        or "Guest"
    )

    context.csrf_token = frappe.sessions.get_csrf_token()
    context.user_full_name = user_full_name
    context.user_initial = user_full_name.strip()[:1].upper() or "G"
    context.full_width = True
    context.no_cache = 1
    return context

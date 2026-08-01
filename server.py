"""
===============================================================================
MAHARASHTRA HTE DECISION INTELLIGENCE PLATFORM
Django Backend Server Entry Point
===============================================================================
Launches production Django WSGI application on port 8000.
100% backward compatible with all API routes and frontend contracts.
===============================================================================
"""

import os
import sys

# Add hte_django directory to Python path
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
HTE_DJANGO_DIR = os.path.join(PROJECT_ROOT, "hte_django")

if HTE_DJANGO_DIR not in sys.path:
    sys.path.insert(0, HTE_DJANGO_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hte_django.settings")

from django.core.wsgi import get_wsgi_application
from wsgiref.simple_server import make_server

application = get_wsgi_application()

if __name__ == "__main__":
    host = "127.0.0.1"
    port = 8000
    print(f"[Django Server] Starting Maharashtra HTE Decision Intelligence Backend on http://{host}:{port}")
    httpd = make_server(host, port, application)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Django server...")

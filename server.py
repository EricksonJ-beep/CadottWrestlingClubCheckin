import os
from flask import Flask, send_from_directory

# Absolute path to the static site folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, 'cadott-wrestling-attendance', 'public')

app = Flask(__name__, static_folder=PUBLIC_DIR, static_url_path='')

@app.route('/')
def index():
    # Serve main page
    return send_from_directory(PUBLIC_DIR, 'index.html')

@app.route('/<path:path>')
def static_proxy(path: str):
    # Serve any file that exists under public, else fall back to index (for SPA-like routing)
    full_path = os.path.join(PUBLIC_DIR, path)
    if os.path.isfile(full_path):
        return send_from_directory(PUBLIC_DIR, path)
    # Fallback to index.html
    return send_from_directory(PUBLIC_DIR, 'index.html')

@app.errorhandler(404)
def not_found(_):
    # Friendly fallback
    return send_from_directory(PUBLIC_DIR, 'index.html'), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', '8080'))
    app.run(host='0.0.0.0', port=port)

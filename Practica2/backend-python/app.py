import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from config.db import test_connection
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.files import files_bp

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "PUT", "PATCH", "DELETE"], allow_headers=["Content-Type", "Authorization"])

# Registrar blueprints
app.register_blueprint(auth_bp,  url_prefix='/api/auth')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(files_bp, url_prefix='/api/files')

# Health check
@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'server': 'Python', 'framework': 'Flask'})

if __name__ == '__main__':
    test_connection()
    port = int(os.getenv('PORT', 5000))
    print(f' Servidor Python corriendo en puerto {port}')
    app.run(host='0.0.0.0', port=port, debug=False)
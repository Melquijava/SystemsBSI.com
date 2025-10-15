import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

VOLUME_PATH = os.environ.get('RAILWAY_VOLUME_MOUNT_PATH', '.')
if not os.path.exists(VOLUME_PATH):
    VOLUME_PATH = '/data' 
    
contador_file = os.path.join(VOLUME_PATH, 'contador.txt')

@app.route('/api/visitas', methods=['GET'])
def get_visitas():
    visitas = 0
    try:
        with open(contador_file, 'r') as f:
            visitas = int(f.read())
    except FileNotFoundError:
        visitas = 0
    except ValueError:
        visitas = 0

    visitas += 1

    with open(contador_file, 'w') as f:
        f.write(str(visitas))

    return jsonify({'visitas': visitas})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
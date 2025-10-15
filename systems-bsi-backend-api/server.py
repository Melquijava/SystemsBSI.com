import os
from flask import Flask, jsonify
from flask_cors import CORS

# Cria a aplicação Flask
app = Flask(__name__)
# Habilita o CORS para permitir que seu frontend acesse esta API
CORS(app)

# --- CONFIGURAÇÃO CRÍTICA PARA O VOLUME DO RAILWAY ---
# O Railway monta o volume em um diretório específico. Vamos usar /data.
# Se a pasta não existir (no ambiente local), usamos a pasta atual.
VOLUME_PATH = os.environ.get('RAILWAY_VOLUME_MOUNT_PATH', '.')
if not os.path.exists(VOLUME_PATH):
    # No Railway, esta pasta será /data, que é o volume.
    VOLUME_PATH = '/data' 
    
contador_file = os.path.join(VOLUME_PATH, 'contador.txt')

@app.route('/api/visitas', methods=['GET'])
def get_visitas():
    visitas = 0
    try:
        # Tenta ler o arquivo do contador
        with open(contador_file, 'r') as f:
            visitas = int(f.read())
    except FileNotFoundError:
        # Se o arquivo não existe, começamos com 0
        visitas = 0
    except ValueError:
        # Se o arquivo estiver vazio ou corrompido, começamos com 0
        visitas = 0

    # Incrementa a contagem de visitas
    visitas += 1

    # Salva o novo valor no arquivo
    with open(contador_file, 'w') as f:
        f.write(str(visitas))

    # Retorna o valor como JSON, no mesmo formato que seu JS espera
    return jsonify({'visitas': visitas})

if __name__ == '__main__':
    # Esta parte é útil para testar localmente, mas não é usada pelo Railway
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
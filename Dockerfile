# 1. Imagem oficial estável do Python
FROM python:3.10-slim

# 2. Instala os pacotes gráficos indispensáveis para o WeasyPrint desenhar o PDF
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# 3. Define a pasta do app no servidor
WORKDIR /app

# 4. Instala as bibliotecas do Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia o seu código do projeto
COPY . .

# 6. Expõe a porta do Flask
EXPOSE 5000

# 7. Inicializa o servidor em produção
CMD ["gunicorn", "-b", "0.0.0.0:5000", "server:app"]
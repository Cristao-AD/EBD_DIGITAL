# 1. Usa uma imagem oficial do Python estável
FROM python:3.10-slim

# 2. Instala TODAS as dependências do sistema que o WeasyPrint exige para compilar PDF
RUN apt-get update && apt-get install -y --no-install-recommens \
    build-essential \
    python3-dev \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    python3-cffi \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    fonts-liberation \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. Define a pasta de trabalho dentro do servidor
WORKDIR /app

# 4. Copia as dependências e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia o restante do código do projeto
COPY . .

# 6. Define a porta padrão que o Flask vai rodar
EXPOSE 5000

# 7. Comando oficial de inicialização usando o Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "server:app"]
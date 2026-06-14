# 1. Usa uma imagem oficial do Python estável e leve
FROM python:3.10-slim

# 2. Atualiza os repositórios com comandos de segurança contra falhas de rede e instala pacotes
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
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

# 3. Define o diretório de execução interno
WORKDIR /app

# 4. Copia e instala primeiro os pacotes Python (otimiza o cache do Render)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia o restante dos arquivos do projeto
COPY . .

# 6. Abre a porta de comunicação do Flask
EXPOSE 5000

# 7. Comando estável para rodar o Gunicorn em produção
CMD ["gunicorn", "-b", "0.0.0.0:5000", "server:app"]
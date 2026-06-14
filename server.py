import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from weasyprint import HTML
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.encoders import encode_base64

app = Flask(__name__)
CORS(app) # Permite que o frontend JS envie requisições sem erro

@app.route('/api/enviar-relatorio', methods=['POST'])
def enviar_relatorio():
    dados_requisicao = request.get_json()
    email_destino = dados_requisicao.get('email_destino', 'danilolex5@gmail.com')
    membros = dados_requisicao.get('dados', [])

    # 1. Monta as linhas da tabela dinamicamente em HTML puro estruturado
    linhas_tabela = ""
    for m in membros:
        linhas_tabela += f"""
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e6e8ee; text-align: left;">{m['nome']}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e6e8ee; text-align: center; color:#8a6a14;"><strong>{m['talentos']} 💰</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #e6e8ee; text-align: center; color:#2950c2;"><strong>{m['presencas']} 📅</strong></td>
        </tr>
        """

    # 2. Template estruturado profissional usando CSS paged media
    html_template = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{ size: A4; margin: 20mm 15mm; }}
            body {{ font-family: sans-serif; color: #1d1f2c; }}
            h1 {{ color: #2950c2; border-bottom: 2px solid #2950c2; padding-bottom: 8px; margin-bottom: 5px; }}
            p {{ color: #6b6f7d; margin-top: 0; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th {{ background: #2950c2; color: white; text-align: left; padding: 12px 10px; font-size: 14px; }}
            tr:nth-child(even) {{ background: #f8f9fa; }}
        </style>
    </head>
    <body>
        <h1>EBD Digital — Relatório de Atividades</h1>
        <p>Fechamento de chamadas e controle de saldos da Escola Bíblica Dominical.</p>
        <table>
            <thead>
                <tr>
                    <th style="text-align: left;">Nome do Membro</th>
                    <th style="text-align: center; width: 100px;">Talentos</th>
                    <th style="text-align: center; width: 100px;">Presenças</th>
                </tr>
            </thead>
            <tbody>
                {linhas_tabela}
            </tbody>
        </table>
    </body>
    </html>
    """

    # 3. Compila o HTML para PDF nativo usando WeasyPrint
    pdf_path = "relatorio_ebd.pdf"
    HTML(string=html_template).write_pdf(pdf_path)

    # 4. Configuração das Variáveis de Ambiente do Render para envio de e-mails
    try:
        # Puxa as configurações secretas que salvamos na aba Environment do Render
        remetente = os.getenv('EMAIL_REMETENTE')
        senha_app = os.getenv('EMAIL_PASSWORD')
        
        if not remetente or not senha_app:
            return jsonify({"status": "error", "message": "Configuracoes de credenciais ausentes no painel do Render."}), 500

        msg = MIMEMultipart()
        msg['From'] = remetente
        msg['To'] = email_destino
        msg['Subject'] = "EBD Digital - Relatório Geral Pós-Aula"
        
        corpo = "Olá! Segue em anexo o relatório PDF gerado pelo sistema com os talentos e presenças atualizados dos membros."
        msg.attach(MIMEText(corpo, 'plain'))
        
        # Anexa o PDF compilado
        with open(pdf_path, "rb") as f:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(f.read())
            encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename="{pdf_path}"')
            msg.attach(part)
            
        # Conexão SMTP com TLS segura
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(remetente, senha_app)
        server.sendmail(remetente, email_destino, msg.as_string())
        server.quit()
        
        # Remove o arquivo gerado do disco temporário para manter o servidor limpo
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        
        return jsonify({"status": "success", "message": "E-mail enviado!"}), 200
        
    except Exception as e:
        # Garante a limpeza do arquivo mesmo em caso de falha de envio
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # O Render configura a porta dinamicamente pela variável PORT, se não achar usa a 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
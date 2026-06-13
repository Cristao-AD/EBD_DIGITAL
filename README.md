# EBD Digital — AD Missão 1203 (HTML/CSS/JS)

Versão inicial (HTML + CSS + JavaScript puro) do app EBD Digital.
Funciona 100% offline no navegador, sem build, sem dependências.

## Como rodar

Basta abrir `index.html` em qualquer navegador moderno.
Para evitar restrições de `file://` em alguns navegadores, você pode rodar um servidor local:

```bash
# Python 3
python3 -m http.server 8080
# ou Node
npx serve .
```

Depois acesse: http://localhost:8080

## Estrutura

- `index.html` — shell HTML
- `styles.css` — todo o design (cores, layout, botões, modais)
- `app.js` — lógica completa (store, rotas hash, views, persistência em localStorage)
- `logo-ad.jpg` — logo da Assembleia de Deus Missão 1203

## Recursos

- Tela inicial com escolha "Sou Participante" / "Sou Administrador"
- Senha do administrador: ****
- Membros, Cadastro (admin), Relatórios
- Perfil do participante: editar nome (clique no lápis), classe, registrar presença, adicionar/remover talentos
- Histórico de movimentações (talentos)
- Dados salvos automaticamente no `localStorage` do navegador

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-contact-middleware',
        configureServer(server) {
          server.middlewares.use('/api/contact', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);
                  const { name, email, desafio } = data;

                  if (!name || !email) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Nome e e-mail são obrigatórios.' }));
                    return;
                  }

                  const botToken = env.TELEGRAM_BOT_TOKEN;
                  const chatId = env.TELEGRAM_CHAT_ID;

                  if (!botToken || !chatId) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Erro de configuração do servidor.' }));
                    return;
                  }

                  const text = `
<b>Novo Contato TALOS (DEV)</b>
<b>Nome:</b> ${name}
<b>E-mail:</b> ${email}
<b>Desafio:</b> ${desafio}
                  `.trim();

                  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
                  const response = await fetch(telegramUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
                  });

                  if (!response.ok) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Falha ao enviar mensagem.' }));
                    return;
                  }

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                } catch (e) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Erro interno do servidor.' }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method not allowed');
            }
          });
        }
      }
    ],
  };
})

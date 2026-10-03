export default async function handler(req: any, res: any) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Tratamento de requisição pre-flight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // Rate Limiting Simples em Memória (5 requisições / hora / IP)
  // Nota: Em ambiente serverless, o estado em memória reseta no cold start, 
  // mas é suficiente para mitigar spam básico.
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  
  if (!global.rateLimit) {
    global.rateLimit = new Map();
  }
  const rateLimit = global.rateLimit;

  const userRate = rateLimit.get(ip);

  if (userRate) {
    if (now - userRate.timestamp < windowMs) {
      if (userRate.count >= 5) {
        return res.status(429).json({ error: 'Muitas requisições. Tente novamente mais tarde.' });
      }
      userRate.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }
  } else {
    rateLimit.set(ip, { count: 1, timestamp: now });
  }

  try {
    const { name, email, desafio } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Configurações do Telegram ausentes no Vercel.');
      return res.status(500).json({ error: 'Erro de configuração do servidor.' });
    }

    const text = `
<b>Novo Contato TALOS</b>
<b>Nome:</b> ${name}
<b>E-mail:</b> ${email}
<b>Desafio:</b> ${desafio}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro na API do Telegram:', errorData);
      return res.status(500).json({ error: 'Falha ao enviar a mensagem. Tente novamente.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro no handler de contato:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

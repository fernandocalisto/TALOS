// Serverless function Vercel — formulario de contato do TALOS via Telegram
// In-memory rate limiting (5 requisicoes por hora por IP)

const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const maxRequests = 5;

  const current = ipRateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (current.count >= maxRequests) return false;
  current.count += 1;
  return true;
}

async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: any) => { raw += chunk; if (raw.length > 10000) { req.destroy(); reject(new Error('Payload too large')); } });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Metodo nao permitido.' }));
    return;
  }

  // Rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Muitas requisicoes. Tente novamente mais tarde.' }));
    return;
  }

  // Validacao de env vars
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Erro de configuracao do servidor.' }));
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const { name, email, desafio } = body || {};

    if (!name?.trim() || !email?.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Nome e e-mail sao obrigatorios.' }));
      return;
    }

    const desafioMap: Record<string, string> = {
      automacao: 'Processos manuais lentos e propensos a falhas',
      integracoes: 'Sistemas e ERPs desconectados (silos de dados)',
      ia: 'Implementacao de IA generativa e agentes autonomos',
      geral: 'Consultoria diagnostica completa',
    };

    const text = [
      '<b>🚀 Novo Contato — TALOS</b>',
      '',
      '<b>Nome:</b> ' + name.trim(),
      '<b>E-mail:</b> ' + email.trim(),
      '<b>Desafio:</b> ' + (desafioMap[desafio] || desafio || 'Nao informado'),
    ].join('\n');

    const telegramUrl = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('[TALOS /api/contact] Erro Telegram:', response.status, errText.slice(0, 200));
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Falha ao enviar a mensagem. Tente novamente.' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
  } catch (err: any) {
    console.error('[TALOS /api/contact] Erro:', err?.message || err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Erro interno do servidor.' }));
  }
}

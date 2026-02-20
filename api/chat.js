console.log("🔥 CHAT API EJECUTÁNDOSE 🔥");
const { getPlan } = require('../lib/plan-store');
const { buildSystemPrompt } = require('../lib/prompt');

function sendJson(res, status, data) {
  res.status(status).json(data);
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Método no permitido.' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return sendJson(res, 500, { error: 'Falta configurar OPENAI_API_KEY en Vercel.' });
    }

    const message = req.body?.message;
    const userName = req.body?.userName;

    if (typeof message !== 'string' || !message.trim()) {
      return sendJson(res, 400, { error: 'Mensaje inválido.' });
    }

    const plan = await getPlan();
    const systemPrompt = buildSystemPrompt({ userName, plan });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return sendJson(res, 500, { error: `Error de OpenAI: ${errorText}` });
    }

    const data = await response.json();

    const reply =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content
        : 'No pude generar una respuesta.';

    return sendJson(res, 200, { reply });

  } catch (error) {
    return sendJson(res, 500, { error: `Error interno: ${error.message}` });
  }
};


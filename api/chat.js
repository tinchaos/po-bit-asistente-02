module.exports = async function handler(req, res) {
  try {
    // Solo aceptamos POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido." });
    }

    // Parse body (a veces viene como string)
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const message = (body && body.message) ? String(body.message) : "(vacío)";
    const name = (body && body.name) ? String(body.name) : "Visitante";

    return res.status(200).json({
      reply: `✅ Conectado OK. Recibí de ${name}: "${message}"`,
    });
  } catch (e) {
    return res.status(200).json({
      reply: "✅ Backend respondió, pero hubo un error interno.",
    });
  }
};
  }
};


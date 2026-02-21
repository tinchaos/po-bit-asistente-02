module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Metodo no permitido"
    });
  }

  try {

    const body = req.body || {};
    const message = body.message || "";
    const name = body.name || "Visitante";

    if (!message) {
      return res.status(400).json({
        error: "Mensaje requerido"
      });
    }

    const reply = `Gracias ${name} por tu consulta.

Soy el asistente estratégico del plan de Martín Urtasun para liderar la evolución de BIT hacia una plataforma conversacional basada en IA Generativa.

El plan estratégico incluye:

• Transformar BIT de un bot guiado a un asistente conversacional real  
• Integrarlo completamente con las Tribus y Customer Journeys  
• Convertirlo en un canal transaccional conectado a APIs  
• Mejorar métricas clave como CSAT y adopción digital  
• Escalar BIT como el principal canal de interacción digital del banco  

¿Querés que te cuente el roadmap de 90 días, los OKRs o la arquitectura técnica?`;

    return res.status(200).json({
      reply: reply
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });

  }

};
  }
};



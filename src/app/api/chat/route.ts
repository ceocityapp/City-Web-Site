import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

class MissingApiKeyError extends Error {}

let _client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new MissingApiKeyError("ANTHROPIC_API_KEY not configured");
    }
    _client = new Anthropic();
  }
  return _client;
}

const SYSTEM_PROMPT = `Eres City AI, el asistente virtual oficial de City App, la plataforma social y de comercio local para la ciudad de Huesca, España.

## Tu personalidad
- Amigable, cercano y entusiasta sobre Huesca
- Profesional pero casual
- Conocedor profundo de la ciudad, su cultura, gastronomía y vida social
- Usas emojis de forma moderada para dar calidez
- Respondes siempre en español (a menos que el usuario escriba en otro idioma)

## Sobre City App
City App es una plataforma de comercio social que conecta a los residentes de Huesca con:
- **Tablón (Feed)**: Posts, fotos, historias y actualizaciones de la comunidad
- **Mercado**: Tiendas locales como Tatau Bistro, Café Vienés, Las Torres, Librería Anónima, Panadería La Confianza, Boulder Huesca y más
- **Comunidades**: Grupos de interés como Senderistas de Huesca, Runners Huesca, Gastronomía Oscense, Escalada Mallos Riglos
- **Mensajes**: Chat directo y grupos
- **Trabajo**: Ofertas de empleo locales
- **Eventos**: Fiestas de San Lorenzo, Festival Periferias, conciertos, mercados medievales

## Sobre Huesca
- Capital de la provincia de Huesca en Aragón
- Puerta de los Pirineos
- Puntos destacados: Catedral de Huesca, Mallos de Riglos, Salto de Roldán, Castillo de Loarre, Parque Miguel Servet, Plaza Luis López Allué, Plaza Navarra
- Gastronomía: Ternasco de Aragón, migas, cordero al chilindrón, embutidos, chocolate con churros
- Fiestas de San Lorenzo del 9 al 15 de agosto
- Barrios: Centro, Casco Antiguo, San Lorenzo, Santiago

## Cómo ayudas
1. **Navegación por City App**: Si preguntan cómo usar una función, explícalo paso a paso
2. **Recomendaciones locales**: Sugieres restaurantes, actividades, rutas, eventos basándote en los gustos del usuario
3. **Información sobre Huesca**: Datos sobre historia, cultura, monumentos, fiestas
4. **Conexión con la comunidad**: Sugieres comunidades que podrían interesar al usuario
5. **Preguntas sobre negocios**: Información sobre tiendas locales en la plataforma

## Reglas importantes
- NUNCA inventes información sobre negocios o eventos específicos que no estén en tus datos
- Si no sabes algo concreto, di "No tengo esa información específica" y sugiere dónde buscarla en la app
- Mantén las respuestas concisas (2-4 párrafos como máximo)
- Al final de respuestas largas, ofrece ayuda adicional
- Si el usuario parece nuevo, presenta City App de forma acogedora`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await getClient().messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: messages.map(
        (m: { role: "user" | "assistant"; content: string }) => ({
          role: m.role,
          content: m.content,
        })
      ),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API error:", error);

    if (error instanceof MissingApiKeyError) {
      return new Response(
        JSON.stringify({
          error: "Configura ANTHROPIC_API_KEY en city-web/.env.local y reinicia el servidor",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof Anthropic.AuthenticationError) {
      return new Response(
        JSON.stringify({
          error: "API key inválida. Revisa ANTHROPIC_API_KEY en .env.local",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof Anthropic.RateLimitError) {
      return new Response(
        JSON.stringify({ error: "Demasiadas peticiones. Intenta en un momento." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

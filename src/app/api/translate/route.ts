export async function POST(req: Request) {
    try {
      const { text, target } = await req.json();
  
      if (!text || !target) {
        return new Response(JSON.stringify({ error: "Missing text or target" }), { status: 400 });
      }
  
      const prompt = `Translate the following task from English to ${target}:\n\n"${text}"\n\nJust return the translated sentence, nothing else.`;
  
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct", // or "gemma-7b-it" if preferred
          messages: [
            { role: "system", content: "You are a helpful translation assistant." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });
  
      const data = await groqRes.json();
  
      const translatedText = data.choices?.[0]?.message?.content?.trim();
  
      if (!translatedText) {
        console.error("Groq API returned invalid response:", data);
        return new Response(JSON.stringify({ error: "No valid translation returned" }), { status: 502 });
      }
      
      return Response.json({ translatedText });
    } catch (err: any) {
      console.error("Groq translation error:", err);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
  }
  
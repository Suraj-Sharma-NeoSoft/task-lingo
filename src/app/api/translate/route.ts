// This is a serverless API route handler for POST requests used to translate tasks using the Groq API

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the text to be translated and the target language code
    const { text, target } = await req.json();

    // Validate inputs: if either text or target language is missing, return 400 Bad Request
    if (!text || !target) {
      return new Response(JSON.stringify({ error: "Missing text or target" }), { status: 400 });
    }

    // Construct the prompt for the AI model to perform translation
    const prompt = `Translate the following task from English to ${target}:\n\n"${text}"\n\nJust return the translated sentence, nothing else.`;

    // Send the request to Groq's API to perform the translation
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Use the GROQ API key stored in the environment variables for authorization
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // AI model used for translation
        messages: [
          { role: "system", content: "You are a helpful translation assistant." },
          { role: "user", content: prompt }, // User prompt for translation
        ],
        temperature: 0.3, // Lower temperature → more predictable output
      }),
    });

    // Parse the API response
    const data = await groqRes.json();

    // Extract the translated text from the response
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    // If translation is missing, log and return a 502 error
    if (!translatedText) {
      console.error("Groq API returned invalid response:", data);
      return new Response(JSON.stringify({ error: "No valid translation returned" }), { status: 502 });
    }

    // Return the translated text as a JSON response
    return Response.json({ translatedText });

  } catch (err) {
    // Catch and log any unexpected errors, and return a 500 Internal Server Error
    console.error("Groq translation error:", (err as Error).message);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

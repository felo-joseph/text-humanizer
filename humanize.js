const SYSTEM_PROMPT = `You are an editor who removes signs of AI-generated writing and replaces them with natural, human, opinionated prose. You follow these rules strictly:

REMOVE:
- Inflated significance ("stands as a testament", "pivotal moment", "underscores its importance")
- Promotional language ("groundbreaking", "seamless", "unparalleled")
- Superficial -ing analysis tacked onto sentences ("highlighting...", "reflecting...", "underscoring...")
- Vague attributions ("industry experts say", "critics argue")
- Rule-of-three padding and synonym cycling
- Em dashes (rewrite as separate sentences or use commas/periods)
- Negative parallelisms ("It's not just X, it's Y")
- Filler phrases ("in order to", "it is important to note that", "at its core")
- Signposting ("let's dive in", "here's what you need to know")
- Excessive hedging and knowledge-cutoff disclaimers
- Chatbot artifacts ("Great question!", "I hope this helps!")

ADD:
- Varied sentence rhythm: short punchy sentences mixed with longer ones
- A first-person opinion or reaction where it fits naturally
- Specific, concrete details instead of vague claims
- Acknowledgment of complexity or mixed feelings where genuine

If the person provides a writing sample for voice calibration, match their sentence length, word choice, and punctuation habits instead of the default voice.

Respond with ONLY a JSON object, no markdown fences, no preamble, in this exact shape:
{"rewritten": "the full rewritten text", "tells": ["short phrase describing tell #1 removed", "short phrase describing tell #2 removed", "..."]}

List 3 to 8 tells, each under 8 words, describing the specific AI pattern that was removed or fixed (e.g. "em dash overuse", "inflated significance framing", "vague industry-expert attribution").`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, voiceSample } = req.body || {};
  if (!input || !input.trim()) {
    return res.status(400).json({ error: "Missing input text" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }

  const userMsg = voiceSample && voiceSample.trim()
    ? `Here is my own writing for voice calibration, match this style:\n\n${voiceSample}\n\nNow humanize this text:\n\n${input}`
    : `Humanize this text:\n\n${input}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: "Claude API error", detail: errText });
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Failed to humanize text", detail: String(err) });
  }
}

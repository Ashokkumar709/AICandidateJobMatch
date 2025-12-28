import OpenAI from "openai";

const GROQ_API_KEY = "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"
const client = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function groqMatch({
  match_score,
  skills_found,
  missing_skills,
  jobTitle
}) {
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You explain resume-job matching results clearly and professionally."
      },
      {
        role: "user",
        content: `
Job Title: ${jobTitle}

Match Score: ${match_score}%

Matched Skills: ${skills_found.join(", ") || "None"}
Missing Skills: ${missing_skills.join(", ") || "None"}

Explain this result briefly and suggest how the candidate can improve.
`
      }
    ]
  });

  return completion.choices[0].message.content;
}

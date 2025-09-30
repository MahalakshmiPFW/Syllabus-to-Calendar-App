import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const { text } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text content is required" },
        { status: 400 }
      )
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) 
    // 👆 you can also use gemini-1.5-pro if you want higher quality

    // Send the prompt
    const prompt = `Extract calendar events from this syllabus text. 
Return a JSON array of events with this exact format:
[
  {
    "id": "unique_id",
    "title": "Event title",
    "date": "YYYY-MM-DD",
    "type": "assignment|exam|reading|other",
    "description": "Brief description"
  }
]

Look for:
- Assignment due dates
- Exam dates
- Reading assignments
- Project deadlines
- Important class dates

Syllabus text:
${text}

Return only the JSON array, no other text.`

    const result = await model.generateContent(prompt)

    // Gemini’s text output
    const aiResponse = result.response.text().trim()

    let events
    try {
      let cleanedResponse = aiResponse

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      events = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.error("Raw AI response:", aiResponse)
      return NextResponse.json(
        { error: "Failed to extract events from text" },
        { status: 500 }
      )
    }

    const formattedEvents = events.map((event: any, index: number) => ({
      id: event.id || `event_${index + 1}`,
      title: event.title || "Untitled Event",
      date: new Date(event.date),
      type: event.type || "other",
      description: event.description || "",
    }))

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error("Error processing text:", error)
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 })
  }
}

// import { type NextRequest, NextResponse } from "next/server"

// export async function GET() {
//   return NextResponse.json({ message: "PDF endpoint is working" })
// }

// export async function POST(request: NextRequest) {
//   return NextResponse.json({ message: "PDF POST is working" })
// }

import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { generateContentWithRetry, friendlyGeminiErrorMessage } from "@/lib/gemini-retry"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert to base64 and send directly to Gemini
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const result = await generateContentWithRetry(() =>
      model.generateContent([
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64
          }
        },
        {
          text: `You are extracting calendar events from a syllabus PDF.

STEP 1 - IDENTIFY THE SEMESTER AND YEAR:
Look at the very beginning of the document for the semester/term and year (e.g., "Fall 2024", "Spring 2025", "Summer 2024").
The year will typically be in the title, header, or first few lines of the syllabus.
Remember this semester and year.

STEP 2 - DETERMINE THE DATE RANGE:
Based on the semester identified:
- Fall semester: August to December (of the identified year)
- Spring semester: January to May (of the identified year)
- Summer semester: June to August (of the identified year)

When you see dates like "September 15" or "Week 3" without a year, use the year from STEP 1 and place them in the appropriate semester timeframe.

STEP 3 - EXTRACT EVENTS:
Find all assignments, exams, readings, and important dates in the syllabus.
For each event:
- Use the year identified in STEP 1
- Make sure the month makes sense for the semester (e.g., Fall 2024 events should be between August-December 2024)
- For weekly assignments without specific dates, estimate based on the semester start date

STEP 4 - FORMAT THE OUTPUT:
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

CRITICAL RULES:
- All dates MUST use the year from the syllabus header/title
- Dates must be in YYYY-MM-DD format
- Types must be one of: "assignment", "exam", "reading", or "other"
- Events must fall within the correct semester months (Fall: Aug-Dec, Spring: Jan-May, Summer: Jun-Aug)
- Return ONLY the JSON array, no other text or explanation

Example: If the syllabus says "Fall 2024" at the top and mentions "Midterm in Week 7", estimate it would be around mid-October 2024, not February or any other incorrect month.`
        }
      ])
    )

    const aiResponse = result.response.text().trim()
    console.log("Gemini response:", aiResponse.substring(0, 500))

    let events
    try {
      let cleanedResponse = aiResponse
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      events = JSON.parse(cleanedResponse)
      
      if (!Array.isArray(events)) {
        return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 })
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.error("Raw AI response:", aiResponse)
      return NextResponse.json({ error: "Failed to extract events from PDF" }, { status: 500 })
    }

    const formattedEvents = events.map((event: any, index: number) => {
      // Parse the date and add one day to fix timezone offset
      const eventDate = new Date(event.date)
      eventDate.setDate(eventDate.getDate() + 1)
      
      return {
        id: event.id || `event_${index + 1}`,
        title: event.title || "Untitled Event",
        date: eventDate,
        type: event.type || "other",
        description: event.description || "",
      }
    })

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error("Error processing PDF:", error)
    const { message, status } = friendlyGeminiErrorMessage(error)
    return NextResponse.json({ error: message }, { status })
  }
}
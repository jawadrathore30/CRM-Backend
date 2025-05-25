// ===== File: controllers/formController.js =====
import OpenAI from "openai";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.js";

dotenv.config();

// Initialize OpenAI client (GitHub AI endpoint)
const client = new OpenAI({
	baseURL: "https://models.github.ai/inference",
	apiKey: process.env.GITHUB_TOKEN,
});
const modelName = "openai/gpt-4o";

/**
 * Controller: generateForm
 * POST /generate-form
 * Body: { title: string }
 */
export const generateForm = async (req, res, next) => {
	const { title } = req.body;
	if (!title) {
		return next(errorHandler(400, "Missing title in request body"));
	}

	const prompt =
		`You’re building a “Create Lead” form in a CRM. The lead’s title is: "${title}". ` +
		`Based on that title alone, generate only a JSON array of field definitions that are uniquely relevant to this lead title **and include at least 10 distinct fields**. ` +
		`Do not include generic fields like name, email, phone, company, description, or timeline. ` +
		`Each field object must have the following keys: ` +
		`- name: lowercase identifier, no spaces` +
		`- label: string` +
		`- type: one of "text", "number", "textarea", or "select"` +
		`- placeholder: a sample value to guide the user (e.g., for text fields)` +
		`- (if type is "select") options: array of strings` +
		`Ensure placeholders match the field purpose. ` +
		`Respond strictly with **raw JSON** only (no code fences, no extra text).`;

	try {
		const response = await client.chat.completions.create({
			model: modelName,
			messages: [
				{
					role: "system",
					content:
						"You are an AI assistant that outputs JSON schemas for CRM forms.",
				},
				{ role: "user", content: prompt },
			],
			temperature: 0.0,
			top_p: 1.0,
			max_tokens: 1200,
		});

		let raw = response.choices[0].message.content.trim();
		raw = raw
			.replace(/```json/g, "")
			.replace(/```/g, "")
			.trim();

		let schema;
		try {
			schema = JSON.parse(raw);
		} catch (parseError) {
			console.error("Failed to parse JSON:", raw);
			return next(errorHandler(502, "Invalid JSON returned by AI"));
		}

		return res.json({ fields: schema });
	} catch (aiError) {
		console.error("Error generating form schema:", aiError);
		return next(errorHandler(502, "AI service error: " + aiError.message));
	}
};

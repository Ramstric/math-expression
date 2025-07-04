import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const API_URL = process.env.MATH_EXPR_API_URL;
    const API_KEY = process.env.MATH_EXPR_API_KEY || "";

    if (!API_URL) {
        return res.status(500).json({ error: "API URL not configured" });
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const chunks: Buffer[] = [];

    req.on("data", (chunk) => {
        chunks.push(chunk);
    });

    req.on("end", async () => {
        const body = Buffer.concat(chunks);
        try {
            console.log(req.headers["content-type"]!);
            const response = await fetch(`${API_URL}/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": req.headers["content-type"]!,
                    "x-internal-api-key": API_KEY,
                    "Content-Length": body.length.toString(),
                },
                body: body,
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}`);
            }

            const data = await response.json();
            res.status(response.status).json(data);

        } catch (error: any) {
            console.error("Proxy function error:", error);
            res.status(500).json({ error: "API call failed", details: error.message });
        }
    });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const API_URL = process.env.MATH_EXPR_API_URL;
  const API_KEY = process.env.MATH_EXPR_API_KEY || "";
  
  if (!API_URL) {
    return res.status(500).json({ error: 'API URL not configured' });
  }

  if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': API_KEY,
      }
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
}
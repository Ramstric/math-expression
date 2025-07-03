import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler( req: VercelRequest, res: VercelResponse ): Promise<void> {
  // 1. Get the path from the request query.
  // The `path` will be an array of path segments. e.g., /api/proxy/add/1/2 -> ['add', '1', '2']
  // If the request is just to /api/proxy, path will be undefined.
  const { path } = req.query;
  const destinationPath = Array.isArray(path) ? path.join('/') : '';

  // 2. Get the base URL and API key from environment variables.
  // TypeScript knows these can be `undefined`, prompting us to handle it.
  const apiUrl = process.env.MATH_EXPR_API_URL;
  const apiKey = process.env.MATH_EXPR_API_KEY;

  if (!apiUrl || !apiKey) {
    res.status(500).json({ error: 'API configuration is missing on the server.' });
    return;
  }

  // 3. Construct the full target URL.
  const targetUrl = `${apiUrl}/${destinationPath}`;

  try {
    // 4. Make the actual request to the external API.
    // We use the standard `fetch` API. `RequestInit` provides type hints for the options.
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        // Add your secret API key here
        'x-internal-api-key': apiKey,
        // Forward important headers from the original request.
        // We cast them to string as VercelRequest['headers'] can be string | string[] | undefined.
        'Content-Type': (req.headers['content-type'] as string) || 'application/json',
        'Accept': (req.headers['accept'] as string) || 'application/json',
      },
      // Pass along the body if it exists (for POST, PUT, etc.).
      // req.body is `any` in VercelRequest, so JSON.stringify is safe.
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    };
    
    const apiResponse = await fetch(targetUrl, fetchOptions);

    // 5. Pipe the response back to the client.
    // Get the raw body as text to handle any content type (JSON, XML, text, etc.).
    const data = await apiResponse.text();
    
    // Set the status from the external API's response.
    res.status(apiResponse.status);

    // Copy headers from the external API's response to our response.
    apiResponse.headers.forEach((value, key) => {
      // Avoid setting headers that are automatically handled by Vercel or can cause issues.
      if (key.toLowerCase() !== 'content-encoding' && key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });

    // Send the data back to the original caller.
    res.send(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(502).json({ error: 'Bad Gateway: The proxy encountered an error.' });
  }
}
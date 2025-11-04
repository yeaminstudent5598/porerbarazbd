export const fetcher = async (url: string, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });

  // if not OK, throw with readable info
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch failed (${res.status}): ${text}`);
  }

  try {
    return await res.json();
  } catch {
    const text = await res.text();
    throw new Error(`Invalid JSON: ${text.slice(0, 200)}`);
  }
};

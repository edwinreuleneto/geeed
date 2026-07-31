// Client HTTP genérico. Hoje o app roda em mock (data/), mas este client já fica
// pronto para apontar ao backend/BFF que falará com o Microsoft Graph (SharePoint).
// Ver docs/domain/connectors/sharepoint.md.

function resolveBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_UPSTREAM ?? "http://localhost:3333/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "/api/proxy";
}

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch<TResponse>(
  path: string,
  init?: RequestInit,
): Promise<TResponse> {
  const url = `${resolveBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = await response.text().catch(() => undefined);
    }
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  if (response.status === 204) return undefined as TResponse;

  return (await response.json()) as TResponse;
}

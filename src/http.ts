type RequestInterceptor = (url: string, request: RequestInit) => Promise<[string, RequestInit]> | [string, RequestInit];

type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export class HttpError extends Error {
  code: number;
  details: any;

  constructor({ code, message, details }: { code: number; message: string; details: any }) {
    super(message);

    this.code = code;
    this.details = details;
  }
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = { ...defaultHeaders };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  withPath(subPath: string): ApiClient {
    const child = new ApiClient(this.baseUrl + subPath, this.defaultHeaders);

    child.requestInterceptors = [...this.requestInterceptors];
    child.responseInterceptors = [...this.responseInterceptors];

    return child;
  }

  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async fetch<T>(path: string, options: RequestInit & { overrideUrl?: boolean } = {}): Promise<T> {
    if (path == '/') {
      path = '';
    }

    let url = options.overrideUrl ? path : `${this.baseUrl}${path}`;
    let init: RequestInit = {
      headers: { ...this.defaultHeaders, ...(options.headers || {}) },
      ...options,
      credentials: 'include',
    };

    // Interceptores de request
    for (const interceptor of this.requestInterceptors) {
      [url, init] = await interceptor(url, init);
    }

    // Ejecutar fetch
    let response = await fetch(url, init);

    // Interceptores de response
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    if (!response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        throw new HttpError(await response.json());
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string, options?: RequestInit & { overrideUrl?: boolean }) {
    return this.fetch<T>(path, { ...options, method: 'GET' });
  }
  post<T>(path: string, body?: any, options?: RequestInit) {
    return this.fetch<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
  put<T>(path: string, body?: any, options?: RequestInit) {
    return this.fetch<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  delete<T>(path: string, options?: RequestInit) {
    return this.fetch<T>(path, { ...options, method: 'DELETE' });
  }
}

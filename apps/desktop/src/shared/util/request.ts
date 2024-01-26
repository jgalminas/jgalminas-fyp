
type Request = {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: {}
}

export class RequestBuilder {

  private baseUrl: string;
  private request: Request;
  private headersObj: HeadersInit | undefined = undefined;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.request = {
      url: this.baseUrl,
      method: 'GET'
    }
  }

  public route(...value: string[]) {
    for (const val of value) {
      this.request.url += val;
    }
    return this;
  }

  public query(params: { [key: string]: string | number } | undefined) {
    if (params) {
      Object.keys(params).forEach((k, i) => {
        if (i === 0) {
          this.request.url += '?' + k + '=' + params[k];
        } else if (i === params.length) {
          this.request.url += k + '=' + params[k];
        } else {
          this.request.url += '&' + k + '=' + params[k];
        }
      })
    }
    return this;
  }

  public method(method: Request['method']) {
    this.request.method = method;
    return this;
  }

  public body(data: {}) {
    this.request.body = data;
    return this;
  }

  public headers(headers: HeadersInit) {
    this.headersObj = headers;
    return this;
  }

  public fetch() {

    const options: RequestInit = {
      method: this.request.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(this.headersObj && this.headersObj)
      }
    }

    if (this.request.method !== 'GET' || 'DELETE') {
      options['body'] = JSON.stringify(this.request.body);
    }

    return fetch(this.request.url, options);
  }
}
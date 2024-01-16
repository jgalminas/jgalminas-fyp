import env from "@root/env";

type Request = {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: {}
}

export class RequestBuilder {

  private request: Request = {
    url: env.RENDERER_VITE_API_URL,
    method: 'GET'
  }

  public route(value: string) {
    this.request.url += value;
    return this;
  }

  public query(params: { [key: string]: string | number }) {
    Object.keys(params).forEach((k, i) => {
      if (i === 0) {
        this.request.url += '?' + k + '=' + params[k];
      } else if (i === params.length) {
        this.request.url += k + '=' + params[k];
      } else {
        this.request.url += '&' + k + '=' + params[k];
      }
    })
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

  public fetch() {

    const options: RequestInit = {
      method: this.request.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (this.request.method !== 'GET' || 'DELETE') {
      options['body'] = JSON.stringify(this.request.body);
    }

    return fetch(this.request.url, options);
  }
}
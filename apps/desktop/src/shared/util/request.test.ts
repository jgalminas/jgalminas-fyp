import { RequestBuilder } from './request';

describe('RequestBuilder', () => {
  let requestBuilder: RequestBuilder;
  const baseUrl = 'https://example.com/api';

  beforeEach(() => {
    requestBuilder = new RequestBuilder(baseUrl);
  });

  it('Should construct a request with the correct base URL', () => {
    expect(requestBuilder['baseUrl']).toBe(baseUrl);
    expect(requestBuilder['request'].url).toBe(baseUrl);
  });

  it('Should set route correctly', () => {
    const route = '/test';
    requestBuilder.route(route);
    expect(requestBuilder['request'].url).toBe(baseUrl + route);
  });

  it('Should set query parameters correctly', () => {
    const params = { param1: 'value1', param2: 123 };
    requestBuilder.query(params);
    expect(requestBuilder['request'].url).toBe(`${baseUrl}?param1=value1&param2=123`);
  });

  it('Should handle empty query parameters', () => {
    requestBuilder.query({});
    expect(requestBuilder['request'].url).toBe(baseUrl);
  });

  it('Should set method correctly', () => {
    const method = 'POST';
    requestBuilder.method(method);
    expect(requestBuilder['request'].method).toBe(method);
  });

  it('Should set body correctly', () => {
    const body = { key: 'value' };
    requestBuilder.body(body);
    expect(requestBuilder['request'].body).toEqual(body);
  });

  it('Should set headers correctly', () => {
    const headers = { 'Authorization': 'Bearer token' };
    requestBuilder.headers(headers);
    expect(requestBuilder['headersObj']).toEqual(headers);
  });

  it('Should handle empty headers', () => {
    // @ts-expect-error
    requestBuilder.headers(undefined);
    expect(requestBuilder['headersObj']).toBeUndefined();
  });

  it('Should fetch with default GET method if not specified', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response());
    await requestBuilder.fetch();
    expect(fetchSpy).toHaveBeenCalledWith(baseUrl, expect.objectContaining({ method: 'GET' }));
    fetchSpy.mockRestore();
  });

  it('Should fetch with correct method and body', async () => {
    const method = 'POST';
    const body = { key: 'value' };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response());
    requestBuilder.method(method).body(body);
    await requestBuilder.fetch();
    expect(fetchSpy).toHaveBeenCalledWith(baseUrl, expect.objectContaining({ method, body: JSON.stringify(body) }));
    fetchSpy.mockRestore();
  });

});
import env from "@root/env";
import { RequestBuilder } from "@root/shared/util/request";

export class ClientRequestBuilder extends RequestBuilder {
  
  constructor() {
    super(env.RENDERER_VITE_API_URL);
  }
}
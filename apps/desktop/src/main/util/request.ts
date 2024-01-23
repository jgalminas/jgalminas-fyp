import env from "../../env";
import { RequestBuilder } from "../../shared/util/request";

export class MainRequestBuilder extends RequestBuilder {

  constructor() {
    super(env.RENDERER_VITE_API_URL);
  }

}
import { IUser, Regions } from "@fyp/types"
import { ClientRequestBuilder } from "@renderer/util/request"

export const updateSummoner = async(data: { name: string, tag: string, region: Regions }) => {
  const res = await new ClientRequestBuilder()
    .route("/v1/user/summoner")
    .method("PUT")
    .body(data)
    .fetch();

    if (res.status === 400) {
      return {
        status: "error" as const,
        message: "This summoner does not exist"
      }
    }

    return {
      status: "success" as const,
      summoner: await res.json() as unknown as NonNullable<Pick<IUser, "summoner">["summoner"]>
    }
}
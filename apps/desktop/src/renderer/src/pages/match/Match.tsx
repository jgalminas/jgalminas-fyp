import Divider from "@renderer/core/page/Divider";
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Page from "@renderer/layouts/Page";
import { useParams } from "react-router";

const Match = () => {

  const { matchId } = useParams();

  return (
    <Page>
      <PageHeader>
        <PageTitle> Match </PageTitle>
        <Divider/>
      </PageHeader>

    </Page>
  )
}

export default Match;
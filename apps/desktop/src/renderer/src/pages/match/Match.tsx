import Divider from "@renderer/core/page/Divider";
import PageContent from "@renderer/core/page/PageContent";
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Page from "@renderer/layouts/Page";
import { useEffect } from "react";
import { useParams } from "react-router";

const Match = () => {

  const { matchId } = useParams();

  return (
    <Page>
      <PageHeader>
        <PageTitle> Match </PageTitle>
        <p> Normal </p>
        <Divider/>
      </PageHeader>
      <PageContent>
        hi
      </PageContent>
    </Page>
  )
}

export default Match;
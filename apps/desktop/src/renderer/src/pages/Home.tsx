import Page from "@renderer/core/page/Page";
import PageBody from "@renderer/core/page/PageBody";
import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import PageTitle from "@renderer/core/page/PageTitle";

const Home = () => {
  return (
    <Page pageClass="max-w-[80rem]" contentClass="gap-0">
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-3">
        <PageTitle> Home </PageTitle>
      </PageInnerHeader>

      <PageBody>
        {/* TODO */}
      </PageBody>
    </Page>
  )
}

export default Home;

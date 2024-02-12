import Page from "../core/page/Page";
import { Editor } from "../core/Editor";
import { Fragment } from "react";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";

const Home = () => {

  return (
    <div className="h-screen overflow-hidden">
      <DefaultHeader/>
      <Editor/>
    </div>
    // <Page contentClass="gap-0" pageClass="max-w-full" className="p-0 overflow-hidden">
    // </Page>
  )
}

export default Home;
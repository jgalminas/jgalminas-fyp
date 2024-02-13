import { videoUrl } from "@renderer/util/video";
import { Editor } from "../core/editor/Editor";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";

const Home = () => {

  const videoSrc = videoUrl("6802422436", "recording");

  return (
    <div className="h-screen grid grid-rows-[auto,1fr] overflow-hidden">
      <DefaultHeader/>
      <Editor videoSrc={videoSrc}/>
    </div>
  )
}

export default Home;
import { useEffect, useState } from "react";
import Page from "../../layouts/Page";
import RecordingCard from "./RecordingCard";

export type VideoData = {
  name: string,
  path: string,
  size: number, 
  created: Date
  length?: number
}

const Recordings = () => {

  const [videos, setVideos] = useState<VideoData[]>([]);

  useEffect(() => {

    const loadVideos = async() => {
      setVideos(await window.api.file.getVideos()); 
    }
    
    loadVideos();

  }, [])

  return ( 
    <Page>
        Recordings
        { videos.map((v, key) => (
          <RecordingCard video={v} key={key}/>
        )) }
    </Page>
  )
}

export default Recordings;
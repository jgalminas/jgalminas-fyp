import { getMatchEvents } from "@renderer/api/match";
import { getRecording } from "@renderer/api/recording";
import Loading from "@renderer/core/Loading";
import { Editor } from "@renderer/core/editor/Editor";
import InfoMessage from "@renderer/core/message/InfoMessage";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const EditorPage = () => {

  const { recordingId, matchId } = useParams();

  const { data: recording, isLoading: isRecordingLoading } = useQuery({
    queryKey: ['recording', recordingId],
    queryFn: () => getRecording(recordingId as string),
    enabled: recordingId !== undefined
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['events', matchId],
    queryFn: () => getMatchEvents(matchId as string),
    enabled: matchId !== undefined
  });

  const isLoading = isEventsLoading || isRecordingLoading;
  const isData = events && recording;

  return (
    <div className="h-screen grid grid-rows-[auto,1fr] overflow-hidden">
      <DefaultHeader back={-1}/>
      { !isLoading
        ?
        isData ?
        <Editor events={events} recording={recording}/>
        :
        <InfoMessage>
          Recording Not Found
        </InfoMessage>
        :
        <div className="flex justify-center items-center">
          <Loading/>
        </div>
      }
    </div>
  )
}

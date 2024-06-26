import Card from "@renderer/core/Card";
import ThumbnailPlay from "@renderer/core/video/ThumbnailPlay";
import LinkButton from "@renderer/core/LinkButton";
import RoundImage from "@renderer/core/RoundImage";
import PrettyDate from "@renderer/core/PrettyDate";
import { RoleIcons } from "@renderer/util/role";
import { IRecording } from "@fyp/types";
import { Asset } from "@renderer/util/asset";
import { length } from '@renderer/util/time';
import { queue } from "@renderer/util/queue";
import { fileSize } from "@renderer/util/file";
import Dropdown, { DropdownOption } from "@renderer/core/Dropdown";
import Ellipsis from '@assets/icons/Ellipsis.svg?react';
import Info from '@assets/icons/Info.svg?react';
import { DeleteModal } from "@renderer/core/DeleteModal";
import { queryClient } from "@renderer/App";
import { useState } from "react";

export type RecordingCardProps = {
  queryKey: (string | number)[],
  data: {
    recording: IRecording & { match: string },
    thumbnail: { message: 'OK', path: string } | {  message: 'VIDEO_NOT_FOUND' }
  },
  position: number
}

const RecordingCard = ({ queryKey, data, position }: RecordingCardProps) => {

  const Role = data.recording.position && RoleIcons[data.recording.position];
  const size = fileSize(data.recording.size);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const confirmDelete = () => {
    queryClient.setQueryData(queryKey, (
      prev: {
        pageParams: number[],
        pages: {
          recording: IRecording,
          thumbnail: Awaited<ReturnType<typeof window.api.file.getThumbnail>>
        }[][]
      }
    ) => {

      const items = {
        pageParams: prev.pageParams,
        pages: [
          ...prev.pages
        ]
      }

      for (let i = 0; i < items.pages.length; i++) {
        items.pages[i] = items.pages[i].filter(i => i.recording._id.toString() !== data.recording._id.toString());
      }

      return items;
    });

    window.api.file.deleteRecording({
      id: data.recording._id.toString(),
      fileName: data.recording.gameId,
      type: "recording"
    })
  }

  const options: DropdownOption[] = [
    {
      id: 'delete',
      value: 'Delete',
      onClick: () => setModalOpen(true)
    }
  ]


  return (
    <Card data-test-id="recording-card" className="flex p-0">
      { data.thumbnail.message !== 'OK'
        ? (
          <div className="aspect-video w-[19.56rem] text-star-dust-300 flex flex-col items-center justify-center gap-3">
            <Info className="w-8 h-8"/>
            <p className="max-w-[8rem] text-center text-sm text-star-dust-400"> Couldn't locate the recording </p>
          </div>
        )
        : <ThumbnailPlay imgSrc={data.thumbnail.path} to={`/recordings/${data.recording._id}`}/>
      }

      <div className="flex flex-col pl-5 py-5 justify-between">
        <div className="flex items-center gap-4">
          <RoundImage alt={`image of ${data.recording.champion}`} className="w-10 h-10" src={Asset.champion(data.recording.champion)}/>
          <h2 className="text-star-dust-200 font-semibold"> Game #{ position } </h2>
          <div className="flex items-center gap-6 ml-2 text-star-dust-300 text-sm">
            <p> { length(data.recording.length) } </p>
            <div className="flex gap-3 items-center">
            { //@ts-expect-error
              data.recording.position && <Role className="text-star-dust-400"/>
            }
            <p> { queue(data.recording.queueId) } </p>
          </div>
        </div>
      </div>

      <PrettyDate date={new Date(data.recording.createdAt)}/>

      <div className="flex gap-3">
        <LinkButton disabled={data.thumbnail.message !== "OK"} to={`/editor/${data.recording.match}/${data.recording._id}`}>
          Create Highlight
        </LinkButton>
        <LinkButton to={`/matches/${data.recording.match}?champion=${data.recording.champion}`} type='text'> View Match </LinkButton>
      </div>
    </div>

    <div className="ml-auto pt-3 pr-3 flex items-center mb-auto gap-2">
      <p className="flex items-baseline gap-0.5 text-sm text-star-dust-300 font-medium">
        { size[0] }
        <span className="text-xs font-normal text-star-dust-400"> { size[1] } </span>
      </p>
      <Dropdown aria-label="Recording Options" options={options} align="end" className="p-1 rounded-md h-fit w-fit">
        { () => (
          <Ellipsis className="h-6 w-6"/>
        )}
      </Dropdown>
    </div>

    { isModalOpen && <DeleteModal onConfirm={confirmDelete} onClose={() => setModalOpen(false)}/> }
  </Card>
  )
}

export default RecordingCard;

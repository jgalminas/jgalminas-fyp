import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

const VideoModal = () => {

  return createPortal(
    <div className="absolute w-full h-screen bg-black bg-opacity-[15%] top-0 right-0 flex items-center justify-center z-50">
      <div className="w-[80%] h-[80%] bg-woodsmoke-500">
        b
        <Link to='/recordings'> close </Link>
      </div>
    </div>,
    document.getElementById('page') as HTMLElement
  )
}

export default VideoModal;
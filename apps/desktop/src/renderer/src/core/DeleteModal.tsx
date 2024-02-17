import Button from "./Button"
import Modal from "./video/Modal"
import Warning from "@assets/icons/Warning.svg?react";

export type DeleteModalProps = {
  onConfirm: () => void,
  onClose: () => void
}

export const DeleteModal = ({ onConfirm, onClose }: DeleteModalProps) => {

  const confirm = () => {
    onConfirm();
    onClose();
  }

  return (
    <Modal onClose={onClose} className="p-5 rounded-lg flex flex-col gap-6 items-center justify-center w-fit h-fit">
      <div className="flex flex-col items-center">
        <div className="p-2 bg-red-600 bg-opacity-15 rounded-lg text-red-600 my-4">
          <Warning className="w-7 h-7"/>
        </div>
        <h1 className="text-star-dust-200 text-lg font-medium"> Are you sure? </h1>
        <p className="text-star-dust-300 text-sm mt-1 max-w-64 text-center">
          This action cannot be undone. The recording will be lost for ever.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Button onClick={confirm}
        className="bg-red-950 border border-red-900 py-[0.313rem] hover:bg-red-900 text-red-100 w-full justify-center">
          Delete
        </Button>
        <Button styleType="text" className="text-red-100 w-full justify-center" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

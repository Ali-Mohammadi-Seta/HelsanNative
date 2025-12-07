import { IoClose } from "react-icons/io5";
import { Modal } from "./Modal";
import { useModal } from "./useModal";

export default function ModalDemo() {
  const { open, onOpen, onClose } = useModal();
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <button
        className="rounded-md px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
        onClick={onOpen}
      >
        Open reusable modal
      </button>

      <Modal
        open={open}
        onClose={onClose}
        showClose={false}
        size="sm"
        closeOnOverlayClick={false}
      >
        <Modal.Header className="!border-b-0">
          <Modal.Title className="!border-b-0">Delete Project</Modal.Title>
          <IoClose onClick={onClose} />
        </Modal.Header>
        <Modal.Body>
          <div>test</div>
        </Modal.Body>
        <Modal.Footer className="!border-0">
          <div>
            <button>gg</button>
            <button>gg1</button>
          </div>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

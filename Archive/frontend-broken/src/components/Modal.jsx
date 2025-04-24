export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg max-h-[90vh] overflow-y-auto relative w-full max-w-3xl">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }
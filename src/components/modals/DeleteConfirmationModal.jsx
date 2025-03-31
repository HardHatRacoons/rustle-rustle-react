function DeleteConfirmationModal({ isOpen, onClose, onConfirm, fileName }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className=" flex flex-row mb-6">
                    <h2 className="text-2xl font-bold">Delete File</h2>
                </div>
                <p className="text-lg font-bold text-sky-900">
                    Are you sure you want to delete "{fileName}"? <br />
                    <strong>This action is not reversible!</strong>
                </p>

                <div className="flex flex-row justify-end mt-6 gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                        aria-label="cancel-delete-button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                        aria-label="confirm-delete-button"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;

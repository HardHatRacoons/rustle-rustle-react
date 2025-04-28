/*
 * A modal component for confirming file deletion.
 *
 * This modal prompts the user to confirm or cancel deletion of a file.
 * It appears centered on the screen with a darkened backdrop when `isOpen` is `true`.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {() => void} props.onClose - Function to call when the user cancels the deletion.
 * @param {() => void} props.onConfirm - Function to call when the user confirms the deletion.
 * @param {string} props.fileName - Name of the file being deleted, displayed in the modal message.
 * @returns {React.ReactElement|null} A React modal component or `null` if not open.
 */
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
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition hover:cursor-pointer"
                        aria-label="cancel-delete-button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition hover:cursor-pointer"
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

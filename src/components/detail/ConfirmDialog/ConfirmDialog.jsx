import "./ConfirmDialog.css";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog">
      <div className="dialog-content">
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Xác nhận</button>
          <button className="btn btn-secondary" onClick={onCancel}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

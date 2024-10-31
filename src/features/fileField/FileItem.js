import PropTypes from "prop-types"
import React from "react"
import Icon from "../icon/Icon"

export default function FileItem({ file, onClickDelete }) {
    return (
        <li key={file.id}>
            <div className="d-flex my-1">
                {/* pending */}
                {file.status === "pending" ? (
                    <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : null}
                {/* deleting */}
                {file.status === "deleting" ? (
                    <div
                        className="spinner-border spinner-border-sm text-danger"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : null}
                {/* success */}
                {file.status === "success" ? (
                    <span className="text-success">
                        <Icon name="FaRegCircleCheck" collection="fa" />
                    </span>
                ) : null}
                <div className="text-truncate flex-fill ps-2 pe-5">
                    {" "}
                    {file.filename}
                </div>
                {/* delete */}
                {file.status !== "deleting" ? (
                    <button
                        className="btn-close"
                        onClick={() => {
                            onClickDelete(file)
                        }}
                        type="button"
                    >
                        <span className="visually-hidden">Close</span>
                    </button>
                ) : null}
            </div>
        </li>
    )
}

FileItem.propTypes = {
    file: PropTypes.object,
    onClickDelete: PropTypes.func,
}
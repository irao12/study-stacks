'use client'
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'

export default function LeaveClassModal({classToLeave}) {
    const router = useRouter();
    const closeButtonRef = useRef();

    const leaveClass = async (e) => {
        const res = await fetch("/api/class/leaveclass", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Class_Id: classToLeave["Class_Id"] }),
        });

        if (!res.ok) {
            setErrorMessage("Failed to leave class");
        }
        if (res.ok) {
            router.push("/class");
            closeButtonRef.current.click();
        }
    };

    return (
    <div className="modal modal-md" id="leave-class-modal">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Leave Class</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={closeButtonRef}
                        ></button>
                    </div>
                    <div className="modal-body p-3">
                        <div className={`main-button-div`}>
                            <h6>
                                Are you sure you want to leave this class?
                            </h6>
                            <button
                                className="btn btn-danger mt-3 w-100"
                                onClick={leaveClass}
                            >
                                Confirm Leave
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

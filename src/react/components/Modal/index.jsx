import React, { useEffect } from "react";
import { forwardRef, useState, useImperativeHandle, useRef } from "react";
import clsx from "clsx";

export const Modal = forwardRef(({ onSave }, ref) => {
  const [show, setShow] = useState(false);
  const [word, setWord] = useState({ word: "", meaning: "" });
  useImperativeHandle(
    ref,
    () => ({
      open: (word) => {
        setShow(true);
        setWord(word);
        console.log(word);
      },
      close: () => {
        setShow(false);
        setWord({ word: "", meaning: "" });
      },
    }),
    [show, word]
  );

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  const handleEscape = (e) => {
    if (e.key === "Escape") {
      ref.current.close();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      className={clsx("modal fade", { show })}
      id="editWordModal"
      tabIndex="-1"
      aria-labelledby="editWordModalLabel"
      aria-hidden="false"
      style={{
        display: show ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Word </h5>
          </div>
          <div className="modal-body">
            <div className="d-flex flex-column gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Word"
                value={word.word}
                onChange={(e) => setWord({ ...word, word: e.target.value })}
              />
              <textarea
                className="form-control"
                placeholder="Meaning"
                value={word.meaning}
                onChange={(e) => setWord({ ...word, meaning: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => ref.current.close()}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() => {
                onSave(word);
                setShow(false);
                setWord({ word: "", meaning: "" });
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

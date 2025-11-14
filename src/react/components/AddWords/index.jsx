import React, { useEffect } from "react";
import { forwardRef, useState, useImperativeHandle, useRef } from "react";
import clsx from "clsx";

export const AddWords = forwardRef(({ onSave }, ref) => {
  const [show, setShow] = useState(false);
  const [words, setWords] = useState([]);
  const [content, setContent] = useState("");
  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    }),
    [words]
  );

  const onBeforeSave = () => {
    const words = content.split("\n").map((word, index) => {
      const wordText = word.split("/")[0];
      const meaningText = word
        .replaceAll(wordText + "/", "")
        .split("/")
        .join(" - ");

      const wordTextNoNumber = wordText
        .split(" ")
        .filter((w) => Number.isNaN(Number(w.trim())))
        .join(" ");

      return {
        word: wordTextNoNumber.trim(),
        meaning: meaningText.trim(),
        created: new Date().getTime() + index,
      };
    });

    onSave(words);
    setShow(false);
    setContent("");
  };

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
              <textarea
                rows={10}
                className="form-control"
                placeholder="Meaning"
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
              onClick={onBeforeSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

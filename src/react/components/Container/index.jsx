import React from "react";
import { useContainer } from "./useContainer";
import { AddWords } from "../AddWords/index.jsx";
import { Modal } from "../Modal";
import { Block } from "../Block";
import { useRef } from "react";
import clsx from "clsx";

export const Container = () => {
  const modalRef = useRef(null);
  const addWordsRef = useRef(null);
  const {
    words,
    deleteWord,
    editWord,
    isLoading,
    addWords,
    checkWords,
    setCheckWords,
    deleteSelectedWords,
  } = useContainer();

  return (
    <div className="es-container">
      <div className="es-container-header">
        <button
          className="btn btn-sm btn-outline-info fw-bold rounded-pill button-top"
          onClick={() => {
            if (Object.keys(checkWords).length) {
              setCheckWords({});
            } else {
              setCheckWords(
                words.reduce((acc, word) => {
                  acc[word.id] = true;
                  return acc;
                }, {})
              );
            }
          }}
        >
          <Block condition={!Object.keys(checkWords).length}>Check All</Block>
          <Block condition={Object.keys(checkWords).length}>Uncheck All</Block>
        </button>
        <Block condition={Object.values(checkWords).some((value) => value)}>
          <button
            className="btn btn-sm btn-outline-danger fw-bold rounded-pill button-top"
            onClick={() => deleteSelectedWords()}
          >
            ({Object.values(checkWords).filter((value) => value).length}) Delete
            Selected
          </button>
        </Block>

        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-sm btn-outline-info fw-bold rounded-pill button-top"
          onClick={() => modalRef.current?.open({ word: "", meaning: "" })}
        >
          Add Word
        </button>
        <button
          className="btn btn-sm btn-outline-info fw-bold rounded-pill button-top"
          onClick={() => addWordsRef.current?.open()}
        >
          Add Words
        </button>
      </div>
      <div className="es-word-cards">
        {words.map((word, index) => (
          <div
            className={clsx("es-word-card", {
              "is-invalid": !word.word || !word.meaning,
            })}
            key={word.id}
          >
            <div
              className="es-word-card-stt"
              onClick={() =>
                setCheckWords({
                  ...checkWords,
                  [word.id]: !checkWords[word.id],
                })
              }
            >
              {index + 1}
            </div>
            <div className="es-word-card-checkbox">
              <Checkbox
                checked={checkWords[word.id]}
                onChange={() =>
                  setCheckWords({
                    ...checkWords,
                    [word.id]: !checkWords[word.id],
                  })
                }
              />
            </div>
            <div
              className="es-word-card-content"
              onClick={() =>
                setCheckWords({
                  ...checkWords,
                  [word.id]: !checkWords[word.id],
                })
              }
            >
              <div className="es-word-card-title">{word.word}</div>
              <div className="es-word-card-meaning">{word.meaning}</div>
            </div>
            <div className="es-word-card-actions">
              <button
                className="es-word-card-button btn btn-sm edit-button btn-outline-primary"
                onClick={() => modalRef.current?.open(word)}
              >
                Edit
              </button>
              <button
                className="es-word-card-button btn btn-sm delete-button btn-outline-danger"
                onClick={() => deleteWord(word)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal ref={modalRef} onSave={editWord} />
      <AddWords ref={addWordsRef} onSave={addWords} />
      <Spinner show={isLoading} />
    </div>
  );
};

const Spinner = ({ show }) => {
  return (
    <div
      style={{
        display: show ? "flex" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const Checkbox = ({ checked, onChange }) => {
  return (
    <div
      className={`es-checkbox ${checked ? "is-checked" : ""}`}
      onClick={onChange}
    >
      <Block condition={checked}>
        <div className="es-checkbox-checked"></div>
      </Block>
    </div>
  );
};

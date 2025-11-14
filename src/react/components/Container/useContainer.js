import { useState, useEffect } from "react";
import { wordsService } from "../../../services/firebase";
import Swal from "sweetalert2";

export const useContainer = () => {
    const [words, setWords] = useState(wordsService.localStore.get());
    const [isLoading, setIsLoading] = useState(false);
    const [checkWords, setCheckWords] = useState({});
    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = () => {
        return new Promise((resolve, reject) => {
            wordsService
                .get()
                .then((words) => {
                    setWords(words);
                    resolve(words);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const deleteWord = ({ id }) => {
        Swal.fire({
            title: "Are you sure you want to delete this word?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                wordsService
                    .delete(id)
                    .then(() => {
                        fetchWords().finally(() => {
                            setIsLoading(false);
                        });
                    })
                    .catch(() => {
                        setIsLoading(false);
                    });
            }
        });
    };

    const editWord = (word) => {
        setIsLoading(true);
        wordsService.set(word);
        fetchWords().finally(() => {
            setIsLoading(false);
        });
    };

    const addWords = (words) => {
        setIsLoading(true);
        Promise.all(words.map((word) => {
            return wordsService.set(word);
        })).then(() => {
            fetchWords().finally(() => {
                setIsLoading(false);
            });
        }).catch(() => {
            setIsLoading(false);
        });
    };

    const deleteSelectedWords = () => {
        Swal.fire({
            title: "Are you sure you want to delete these words?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                Promise.all(
                    Object.keys(checkWords).filter(id => checkWords[id]).map((id) => wordsService
                        .delete(id))
                ).then(() => {
                    fetchWords().finally(() => {
                        setIsLoading(false);
                        setCheckWords({});
                    });
                })
            }
        });
    };

    return {
        words,
        deleteWord,
        editWord,
        isLoading,
        addWords,
        checkWords,
        setCheckWords,
        deleteSelectedWords
    };
};

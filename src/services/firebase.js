// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, setDoc, getFirestore, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import Swal from 'sweetalert2'

// Your web app's Firebase configuration
const COLLECTION_NAME = "words";
const firebaseConfig = {
    apiKey: "AIzaSyCJ2nLdtuwQkJrVMfouSkZiA2b9GUQEymk",
    authDomain: "briscoes-9aba6.firebaseapp.com",
    projectId: "briscoes-9aba6",
    storageBucket: "briscoes-9aba6.firebasestorage.app",
    messagingSenderId: "917373508261",
    appId: "1:917373508261:web:f668f9707e6bf9b4900b4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export const wordsService = {
    get: async () => {
        const words = []
        const snapshot = await getDocs(collection(database, COLLECTION_NAME))
        snapshot.docs.forEach((doc) => {
            words.push({
                ...doc.data(),
                id: doc.id,
            })
        });
        const sortedWords = words.sort((a, b) => a.created - b.created);
        window.localStorage.setItem(COLLECTION_NAME, JSON.stringify(sortedWords));
        return sortedWords;
    },
    set: ({ id, ...value }) => {
        return new Promise((resolve, reject) => {
            try {
                if (id) {
                    const ref = doc(database, COLLECTION_NAME, id);
                    updateDoc(ref, {
                        ...value,
                    }).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    const ref = collection(database, COLLECTION_NAME);
                    addDoc(ref, {
                        ...value,
                        created: new Date().getTime()
                    }).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                }
            } finally {
                resolve();
            }
        });
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            deleteDoc(doc(database, COLLECTION_NAME, id)).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    },
    localStore: {
        get: () => {
            return JSON.parse(localStorage.getItem(COLLECTION_NAME)) || [];
        },
        set: (value) => {
            localStorage.setItem(COLLECTION_NAME, JSON.stringify(value));
        }
    }
};
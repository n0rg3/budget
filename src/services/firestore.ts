import { collection, addDoc } from "firebase/firestore";
import { enableIndexedDbPersistence } from "firebase/firestore";

import { db } from "./firebaseConfig";

export async function addExpense(userId: string, expense: { name: string; amount: number; category: string }) {
  try {
    await addDoc(collection(db, `users/${userId}/expenses`), expense);
    console.log("Expense added!");
  } catch (error) {
    console.error("Error adding expense:", error);
  }
}



export function listenExpenses(userId: string, callback: (data: any[]) => void) {
  const ref = collection(db, `users/${userId}/expenses`);
  return onSnapshot(ref, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}


enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support persistence.');
  }
});

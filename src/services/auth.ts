import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
  }
}

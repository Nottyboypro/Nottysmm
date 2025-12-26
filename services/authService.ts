
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { auth, db } from "./firebase.ts";
import { User } from "../types.ts";

export class AuthService {
  /**
   * Generates a unique 5-digit integer ID
   */
  private static async generateUniqueUserId(): Promise<string> {
    let isUnique = false;
    let newId = "";
    
    while (!isUnique) {
      const num = Math.floor(10000 + Math.random() * 90000);
      newId = num.toString();
      
      const q = query(collection(db, "users"), where("id", "==", newId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }
    return newId;
  }

  static async signup(username: string, email: string, password: any): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // 2. Generate 5-digit ID
      const userId = await this.generateUniqueUserId();

      const userData: User = {
        id: userId,
        username,
        email,
        balance: 0,
        currency: 'INR',
        isAdmin: false,
        status: 'active',
        totalSpent: 0,
        lastLogin: new Date().toLocaleString()
      };

      // 3. Save to Firestore
      await setDoc(doc(db, "users", fbUser.uid), userData);

      return { success: true, message: `Welcome! Your User ID is ${userId}`, user: userData };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async login(email: string, password: any): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // Fetch Firestore profile
      const userDoc = await getDoc(doc(db, "users", fbUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error("User profile not found in cloud.");
      }

      const userData = userDoc.data() as User;
      
      if (userData.status === 'banned') {
        await signOut(auth);
        throw new Error("This account is suspended.");
      }

      return { success: true, message: "Logged in successfully", user: userData };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  static async logout() {
    await signOut(auth);
  }

  static async getCurrentUserProfile(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  }
}

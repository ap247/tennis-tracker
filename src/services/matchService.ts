import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Match } from '../types';

const COLLECTION_NAME = 'matches';

export const matchService = {
  async getAllMatches(): Promise<Match[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Match));
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  },

  async addMatch(match: Omit<Match, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), match);
      return docRef.id;
    } catch (error) {
      console.error('Error adding match:', error);
      throw error;
    }
  },

  async updateMatch(id: string, match: Partial<Match>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, match);
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  },

  async deleteMatch(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting match:', error);
      throw error;
    }
  }
};
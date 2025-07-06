import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Match } from '../types';

const COLLECTION_NAME = 'matches';

export const matchService = {
  async getAllMatches(userId: string): Promise<Match[]> {
    try {
      console.log('🔥 Attempting to connect to Firebase for user:', userId);
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      console.log('🔥 Query created, fetching documents...');
      const querySnapshot = await getDocs(q);
      console.log('🔥 Documents fetched successfully!', querySnapshot.size, 'matches found');
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Match));
    } catch (error) {
      console.error('🚨 Firebase Error Details:', error);
      console.error('🚨 Error code:', (error as any)?.code);
      console.error('🚨 Error message:', (error as any)?.message);
      throw error;
    }
  },

  async addMatch(match: Omit<Match, 'id'>, userId: string): Promise<string> {
    try {
      const matchWithUser = {
        ...match,
        userId,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), matchWithUser);
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
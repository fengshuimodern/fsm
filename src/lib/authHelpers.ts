import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export async function transferLocalStorageToFirestore(userId: string) {
  const tempUserData = localStorage.getItem('tempUserData');
  const roomLayout = localStorage.getItem('roomLayout');
  const tempFloorPlan = localStorage.getItem('tempFloorPlan');

  if (tempUserData) {
    await setDoc(doc(db, 'users', userId), JSON.parse(tempUserData), { merge: true });
    localStorage.removeItem('tempUserData');
  }

  if (roomLayout) {
    await setDoc(doc(db, 'users', userId), { roomLayout }, { merge: true });
    localStorage.removeItem('roomLayout');
  }

  if (tempFloorPlan) {
    const storageRef = ref(storage, `floorPlans/${userId}`);
    await uploadString(storageRef, tempFloorPlan, 'data_url');
    const floorPlanUrl = await getDownloadURL(storageRef);
    await setDoc(doc(db, 'users', userId), { floorPlanUrl }, { merge: true });
    localStorage.removeItem('tempFloorPlan');
  }

  // Transfer any other relevant data from localStorage to Firestore here
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith('fengshui_')) {
      const value = localStorage.getItem(key);
      if (value) {
        await setDoc(doc(db, 'users', userId), { [key]: value }, { merge: true });
        localStorage.removeItem(key);
      }
    }
  }
}
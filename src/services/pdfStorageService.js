// IndexedDB Storage Service for Large PDF Documents (No 5MB quota limits)

const DB_NAME = 'BIT_App_PDF_Storage_DB';
const DB_VERSION = 1;
const STORE_NAME = 'admin_uploaded_schedules';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'type' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePdfDocumentToDB(type, docObj) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = { type, ...docObj };
      store.put(record);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to localStorage if small:', err);
    try {
      const saved = JSON.parse(localStorage.getItem('bit_admin_uploaded_documents') || '{}');
      saved[type] = docObj;
      localStorage.setItem('bit_admin_uploaded_documents', JSON.stringify(saved));
    } catch (lsErr) {}
    return false;
  }
}

export async function loadAllPdfDocumentsFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const records = request.result || [];
        const map = {
          leave_schedule: null,
          boys_menu: null,
          girls_menu: null
        };
        records.forEach(r => {
          if (r.type) {
            map[r.type] = r;
          }
        });

        // Merge any localStorage items if present
        try {
          const lsSaved = JSON.parse(localStorage.getItem('bit_admin_uploaded_documents') || '{}');
          if (lsSaved.leave_schedule && !map.leave_schedule) map.leave_schedule = lsSaved.leave_schedule;
          if (lsSaved.boys_menu && !map.boys_menu) map.boys_menu = lsSaved.boys_menu;
          if (lsSaved.girls_menu && !map.girls_menu) map.girls_menu = lsSaved.girls_menu;
        } catch (e) {}

        resolve(map);
      };
      request.onerror = () => {
        resolve(loadFromLocalStorageFallback());
      };
    });
  } catch (err) {
    return loadFromLocalStorageFallback();
  }
}

function loadFromLocalStorageFallback() {
  try {
    const saved = localStorage.getItem('bit_admin_uploaded_documents');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    leave_schedule: null,
    boys_menu: null,
    girls_menu: null
  };
}

export async function removePdfDocumentFromDB(type) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(type);
      tx.oncomplete = () => {
        try {
          const lsSaved = JSON.parse(localStorage.getItem('bit_admin_uploaded_documents') || '{}');
          delete lsSaved[type];
          localStorage.setItem('bit_admin_uploaded_documents', JSON.stringify(lsSaved));
        } catch (e) {}
        resolve(true);
      };
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    try {
      const lsSaved = JSON.parse(localStorage.getItem('bit_admin_uploaded_documents') || '{}');
      delete lsSaved[type];
      localStorage.setItem('bit_admin_uploaded_documents', JSON.stringify(lsSaved));
    } catch (e) {}
    return false;
  }
}

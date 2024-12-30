/* eslint-disable @typescript-eslint/ban-ts-comment */
const APP_ID = '992a1cb5-a6c4-46f3-b2e9-c108df4d9cc4';
const API_BASE = 'https://nillion-storage-apis-v0.onrender.com';

//@ts-ignore
export const storeData = async ({seed, value, key}) => {
    console.log(seed, value, key)
    // 3. Store second secret (string/blob)
console.log('\nStoring second secret...');
const storeResult2 = await fetch(`${API_BASE}/api/apps/${APP_ID}/secrets`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: {
      nillion_seed: seed,
      secret_value: JSON.stringify(value),
      secret_name: key,
    },
    permissions: {
      retrieve: [],
      update: [],
      delete: [],
      compute: {},
    },
  }),
}).then((res) => res.json());
console.log('Second secret stored at:', storeResult2);
}

export const listStoreID = async () => {
  try {
    const storeIds = await fetch(`${API_BASE}/api/apps/${APP_ID}/store_ids`)
  .then((res) => res.json())
  .then((data) => data.store_ids);

  return storeIds;
  } catch {
    return null
  }
}

//@ts-ignore
export const retrieveSecrets = async ({id, seed, key}) => {
    const secret1 = await fetch(
        `${API_BASE}/api/secret/retrieve/${id}?retrieve_as_nillion_user_seed=${seed}&secret_name=${key}`
      ).then((res) => res.json());
      console.log('First secret retrieved:', secret1);
}


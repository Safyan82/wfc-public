import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { decrypt, encrypt } from '../../util/encryption/encryptDecrypt';
import { rootReducer } from './rootReducer';

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
      {
        // Transform for encrypting data before storing
        in: (state) => ({ ...state, encryptedField: encrypt(state.encryptedField) }),
        out: (state) => ({ ...state, encryptedField: decrypt(state.encryptedField) }),
      },
    ],
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
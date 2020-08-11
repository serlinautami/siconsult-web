import _ from 'lodash';
import { firebase } from '../libraries';
import { currentEnvironment } from './appConfig';

/**
 * initFirebase() adalah function untuk
 * inisiasi layanan firebase pada aplikasi
 */
export async function initFirebase() {
  if (firebase.apps.length === 0) {
    await firebase.initializeApp(currentEnvironment.firebase.config);
  }
  return true;
}

/**
 * @name getUserByUid()
 * @description
 * adalah fungsi untuk mendapatkan data user
 * berdasarkan UID pengguna yang terdaftar
 * @param {*} uid
 * @param {*} params
 */
export const getUserByUid = async (uid, params = {}) => {
  try {
    // get user dari data user
    const datauser = await firebase
      .database()
      .ref(`users/${uid}/`)
      .once('value');
    if (datauser.val()) {
      return {
        ...datauser.val(),
        ...params
      };
    }

    throw new Error('User not found');
  } catch (err) {
    throw err;
  }
};

export const getMasalahById = async function(
  category = '',
  id = '',
  params = {}
) {
  try {
    const snapshot = await firebase
      .database()
      .ref(`categoryMasalah/${category}/${id}`)
      .orderByChild('title')
      .once('value');

    if (!snapshot.val()) {
      return null;
    }

    return {
      ...snapshot.val(),
      ...params
    };
  } catch (err) {
    throw err;
  }
};

/**
 * @name getReportMessageByMasalahId()
 * @description adalah fungsi untuk mendapatkan riwayat message dari pengguna terkait
 * @param {string} userId
 * @param {string} masalahId
 */
export const getReportMessageByMasalahId = async function(
  userId,
  masalahId,
  params = {}
) {
  try {
    const snapshot = await firebase
      .database()
      .ref(`messages/${userId}/`)
      .once('value');

    if (!snapshot.val()) {
      throw new Error({ message: 'Riyawat tidak ditemukan' });
    }

    let data = null;

    Object.keys(snapshot.val()).forEach(function(chatId) {
      if (snapshot.val()[chatId]) {
        const itemMasalahId = chatId.split('_')[2];
        if (itemMasalahId === masalahId) {
          data = {
            id: chatId,
            ...snapshot.val()[chatId]
          };
        }
      }
    });

    if (data && data.uidPartner) {
      const receiver = await getUserByUid(data.uidPartner);
      data = {
        receiver,
        ...data
      };
    }

    return {
      message: data,
      ...params
    };
  } catch (err) {
    throw err;
  }
};

/**
 * @name getRiwayatKonsultasi() ntuk mendapatkan data chatting
 * @description setiap pengguna
 * @param {*} param0
 */
export const getRiwayatKonsultasi = async function({
  senderUid,
  receiverUid,
  itemMasalahId,
  chatId = null,
  params = {}
}) {
  try {
    const chatID = chatId || `${senderUid}_${receiverUid}_${itemMasalahId}`;
    const urlFirebase = `chatting/${chatID}/allChat/`;
    const snapshot = await firebase
      .database()
      .ref(urlFirebase)
      .once('value');
    const allDataChat = [];

    if (snapshot.val()) {
      const dataSnapshot = snapshot.val();
      Object.keys(dataSnapshot).forEach(key => {
        const dataChat = dataSnapshot[key];
        const newDataChat = [];
        Object.keys(dataChat).forEach(itemChat => {
          newDataChat.push({
            id: itemChat,
            data: dataChat[itemChat]
          });
        });

        // newDataChat = newDataChat.reverse();

        allDataChat.push({
          id: key,
          data: newDataChat
        });
      });

      // allDataChat = allDataChat.reverse();
    }
    return {
      chats: allDataChat,
      ...params
    };
  } catch (err) {
    throw err;
  }
};

/**
 * @name getReportByType()
 * @description untuk mendapatkan list laporan berdasarkan tipe
 * @param {*} type
 */
export const getReportByType = async function(type = '') {
  try {
    const snapshot = await firebase
      .database()
      .ref(`reports/${type}`)
      .once('value');

    let data = [];

    if (snapshot.val()) {
      data = Object.keys(snapshot.val()).map(key => ({
        ...snapshot.val()[key],
        reportKey: key
      }));
    }

    return data;
  } catch (err) {
    throw err;
  }
};

/**
 * @name getReportById()
 * @description untuk mendapatkan detail isi laporan
 * @param {*} type
 * @param {*} id
 */
export const getReportById = async function(type = '', id = '') {
  try {
    const snapshot = await firebase
      .database()
      .ref(`reports/${type}/${id}`)
      .once('value');

    let data = null;

    if (snapshot.val()) {
      data = snapshot.val();

      // map user
      data.reportedUsers = Object.keys(data.reportedUsers).map(userId => {
        const userData = getUserByUid(userId, {
          ...data.reportedUsers[userId]
        });
        return userData;
      });
      data.reportedUsers = await Promise.all(data.reportedUsers);

      // map masalah
      data.reportedMasalah = Object.keys(data.reportedMasalah).map(
        masalahId => {
          const resData = getMasalahById(
            data.reportedMasalah[masalahId].categoryId,
            masalahId,
            {
              ...data.reportedMasalah[masalahId]
            }
          );
          return resData;
        }
      );

      data.reportedMasalah = await Promise.all(data.reportedMasalah);

      data.reportedMasalah = data.reportedMasalah.map(async item => {
        let resData = Object.keys(item.users).map(uid => {
          const res = getUserByUid(uid, {
            ...item.users[uid]
          });

          return res;
        });

        resData = await Promise.all(resData);
        item.users = resData;

        return item;
      });

      data.reportedMasalah = await Promise.all(data.reportedMasalah);

      data.reportedMasalah = data.reportedMasalah.map(async item => {
        if (item.users && item.users.length > 0) {
          item.users = item.users.map(user => {
            const messageData = getReportMessageByMasalahId(
              user.uid,
              item.id,
              user
            );
            return messageData;
          });

          item.users = await Promise.all(item.users);
        }

        return item;
      });

      data.reportedMasalah = await Promise.all(data.reportedMasalah);

      data.reportedMasalah = data.reportedMasalah.map(async item => {
        if (item.users && item.users.length > 0) {
          item.users = item.users.map(user => {
            const senderUid = user.uid;
            const receiverUid = _.get(user, 'message.receiver.uid', '');
            const itemMasalahId = item.id;
            const chatId = _.get(user, 'message.id', '');
            const params = user;
            const messageData = getRiwayatKonsultasi({
              senderUid,
              receiverUid,
              itemMasalahId,
              chatId,
              params
            });
            return messageData;
          });

          item.users = await Promise.all(item.users);
        }

        return item;
      });

      data.reportedMasalah = await Promise.all(data.reportedMasalah);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

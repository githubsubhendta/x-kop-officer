import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserStore from '../stores/user.store';
import {getCurrentUser, refreshToken} from '../Api/user.api';
import {useNetwork} from '../shared/NetworkProvider';

const useCheckUser = () => {
  const {localTokens, isLoggedIn, user, addLoggedInUserAction, addLocalTokens} =
    useUserStore();
  const [loading, setLoading] = useState(true);
  const {isConnected} = useNetwork();

  useEffect(() => {
    const checkUser = async () => {
      // if (user == undefined || !user.name) {
      if (localTokens) {
        try {
          setLoading(true);
          const result = await getCurrentUser(localTokens);

          addLoggedInUserAction(result.data.data.user, true);
        } catch (error) {
          addLocalTokens(null);
          await AsyncStorage.removeItem('Authorized_data');
          addLoggedInUserAction({}, false);
          // if (error.response?.status === 401 || error.response?.status === 500) {
          //   try {
          //     const refreshRes = await refreshToken({ refreshToken: localTokens.refreshToken });
          //     const authData = {
          //       accessToken: refreshRes.data.data.accessToken,
          //       refreshToken: refreshRes.data.data.refreshToken,
          //     };
          //     await AsyncStorage.setItem('Authorized_data', JSON.stringify(authData));
          //     const resultUpdate = await getCurrentUser(refreshRes.data.data);
          //     addLoggedInUserAction(resultUpdate.data.data.user, true, authData);
          //   } catch (err) {
          //     addLocalTokens(null);
          //     await AsyncStorage.removeItem('Authorized_data');
          //     addLoggedInUserAction({}, false);
          //   }
          // }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      // } else {
      //   setLoading(false);
      // }
    };

    isConnected && checkUser();
  }, [localTokens]);

  return {
    isLoggedIn,
    loading,
    whatwedoStatus: useUserStore(state => state.whatwedoStatus),
    onboardStatus: useUserStore(state => state.onboardStatus),
  };
};

export default useCheckUser;

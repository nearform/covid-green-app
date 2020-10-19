import React, {useCallback} from 'react';
import {BackHandler} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {BasicLayout} from '../templates/basic-layout';
import {AuthorizationRequired} from '../organisms/authorization-required';
import {Header} from '../molecules/header';

export const CameraPermission: React.FC = () => {
  const navigation = useNavigation();
  const goToMain = useCallback(() => navigation.navigate('main'), [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goToMain();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [goToMain])
  );

  return (
    <>
      <Header onClose={goToMain} />
      <BasicLayout>
        <AuthorizationRequired
          onCancel={goToMain}
          onAndroidPermissionGranted={() => navigation.goBack()}
        />
      </BasicLayout>
    </>
  );
};

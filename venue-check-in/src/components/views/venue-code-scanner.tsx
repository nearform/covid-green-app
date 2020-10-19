import React, {useState, useEffect, useRef, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {QRCodeCamera} from '../molecules/qr-code-camera';
import {QRCodeScanner} from '../molecules/qr-code-scanner';
import {parseQRCodeAndSaveVenue} from '../../services/utils';

export const VenueCodeScanner: React.FC = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [shouldReadBarCode, setShouldReadBarCode] = useState<boolean>(true);
  const [isTransitionCompleted, setIsTransitionCompleted] = useState<boolean>(
    false
  );
  const cameraRef = useRef(null);

  // Every time the component gets focus enable the QR code reader and
  // check camera authorization
  useFocusEffect(
    useCallback(() => {
      setShouldReadBarCode(true);
      if (cameraRef && cameraRef.current) {
        cameraRef.current.refreshAuthorizationStatus();
      }
    }, [cameraRef])
  );

  // Check if navigation transition is finished, we want to avoid to load the camera
  // in the middle of the transition.
  useEffect(() => {
    const unsubscribeEnd = navigation.addListener(
      'transitionEnd' as any,
      () => {
        setIsTransitionCompleted(true);
      }
    );

    return () => {
      unsubscribeEnd && unsubscribeEnd();
    };
  }, [navigation]);

  const readBarCodeContent = async (e: BarCodeReadEvent) => {
    // Avoid to read multiple time the same QR code
    if (shouldReadBarCode) {
      if (e.type === RNCamera.Constants.BarCodeType.qr) {
        setShouldReadBarCode(false);
        try {
          await parseQRCodeAndSaveVenue(e.data);
          navigation.navigate('venueCheckIn.scanSuccess');
        } catch (parseErr) {
          navigation.navigate('venueCheckIn.scanError');
        }
      }
    }
  };

  const checkPermissionStatus = (cameraStatus: any) => {
    if (cameraStatus === RNCamera.Constants.CameraStatus.NOT_AUTHORIZED) {
      navigation.navigate('venueCheckIn.permission');
    }
  };

  const closeModal = () => {
    navigation.goBack();
  };

  // Show a disabled scanner if the navigation transition is not completed
  if (!isTransitionCompleted) {
    return (
      <QRCodeScanner
        disabled={true}
        title={t('venueCheckIn:scan:title')}
        description={t('venueCheckIn:scan:description')}
        footerMessage={t('venueCheckIn:scan:footer')}
        onClose={closeModal}
      />
    );
  }

  return (
    <View style={styles.container}>
      <QRCodeCamera
        cameraRef={cameraRef}
        onBarCodeRead={readBarCodeContent}
        onStatusChange={checkPermissionStatus}
      />
      <QRCodeScanner
        title={t('venueCheckIn:scan:title')}
        description={t('venueCheckIn:scan:description')}
        footerMessage={t('venueCheckIn:scan:footer')}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Linking,
  Platform
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {text, colors, Button, Spacing} from '../../external-dependencies';
import Icons from '../../assets/index';
interface AuthorizationRequiredProps {
  onCancel: () => void;
  onAndroidPermissionGranted?: () => void;
}

export const AuthorizationRequired: React.FC<AuthorizationRequiredProps> = ({
  onCancel,
  onAndroidPermissionGranted
}) => {
  const {t} = useTranslation();

  const requestAndroidCameraPermission = async () => {
    try {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        if (onAndroidPermissionGranted) {
          onAndroidPermissionGranted();
        }
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Linking.openSettings();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openIOSAppSettings = () => {
    Linking.openSettings();
  };

  const requestCameraPermission = () => {
    Platform.OS === 'ios'
      ? openIOSAppSettings()
      : requestAndroidCameraPermission();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Spacing s={74} />
        <Icons.QRCodePhone width={48} height={80} />
        <Spacing s={15} />
        <Text style={styles.title}>
          {t('venueCheckIn:scan:authRequired:title')}
        </Text>
        <Spacing s={8} />
        <Text style={styles.description}>
          {t('venueCheckIn:scan:authRequired:description')}
        </Text>
      </View>
      <Button width="100%" onPress={requestCameraPermission}>
        {t(`venueCheckIn:scan:authRequired:confirmButton`)}
      </Button>
      <Spacing s={12} />
      <Button width="100%" type="empty" onPress={onCancel}>
        {t('venueCheckIn:scan:authRequired:cancelButton')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white
  },

  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    ...text.xxlargeBlack,
    textAlign: 'center'
  },
  description: {
    ...text.large,
    textAlign: 'center'
  }
});

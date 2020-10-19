import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

import {text, colors} from '../../external-dependencies';
import {ScannerArea} from '../atoms/scanner-area';
import {Header} from '../molecules/header';

interface QRCodeScannerProps {
  title: string;
  description: string;
  footerMessage: string;
  disabled?: boolean;
  onClose: () => void;
}

export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  title,
  description,
  footerMessage,
  disabled = false,
  onClose
}) => {
  const insets = useSafeArea();

  return (
    <View
      style={[StyleSheet.absoluteFillObject, disabled ? styles.disabled : {}]}>
      <Header type="dark" onClose={onClose} />
      <View style={styles.container}>
        <ScannerArea />
        <View style={styles.descriptionContainer}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View
            style={[
              styles.footer,
              {paddingBottom: insets.bottom + styles.footer.paddingBottom}
            ]}>
            <Text style={styles.text}>{footerMessage}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  descriptionContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'black',
    opacity: 0.8,
    flex: 0.7,

    paddingHorizontal: 20
  },
  mainContent: {
    flex: 1
  },
  footer: {
    paddingBottom: 30
  },
  title: {
    ...text.xlargeBold,
    color: colors.white,
    textAlign: 'center',
    paddingBottom: 8
  },
  text: {
    ...text.default,
    color: colors.white,
    textAlign: 'center'
  }
});

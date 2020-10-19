import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

import {TransparentButton} from '../atoms/transparent-button';
import {colors, CloseImage as Close} from '../../external-dependencies';

const CloseWhite = require('../../assets/images/close-white/close-white.png');

interface HeaderProps {
  type?: 'default' | 'dark';
  onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({type = 'default', onClose}) => {
  const insets = useSafeArea();

  const CloseIcon = type === 'default' ? Close : CloseWhite;
  const containerBackground = type === 'default' ? styles.default : styles.dark;

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top + styles.container.paddingTop},
        containerBackground
      ]}>
      <TransparentButton onPress={onClose}>
        <Image
          accessibilityIgnoresInvertColors={false}
          style={styles.closeButton}
          width={styles.closeButton.width}
          height={styles.closeButton.height}
          source={CloseIcon}
        />
      </TransparentButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 6,
    paddingHorizontal: 20
  },
  dark: {
    backgroundColor: colors.black,
    opacity: 0.8
  },
  default: {
    backgroundColor: colors.white
  },
  closeButton: {
    width: 24,
    height: 24
  }
});

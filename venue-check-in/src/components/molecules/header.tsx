import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';

import {TransparentButton} from '../atoms/transparent-button';
import {colors} from '../../external-dependencies';
import Icons from '../../assets/index';

interface HeaderProps {
  type?: 'default' | 'dark';
  onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({type = 'default', onClose}) => {
  const insets = useSafeArea();

  const closeColor = type === 'default' ? colors.teal : colors.white;
  const containerBackground = type === 'default' ? styles.default : styles.dark;

  return (
    <View
      style={[
        styles.container,
        {paddingTop: insets.top + styles.container.paddingTop},
        containerBackground
      ]}>
      <TransparentButton onPress={onClose}>
        <Icons.Close height={24} width={24} style={{color: closeColor}} />
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
  }
});

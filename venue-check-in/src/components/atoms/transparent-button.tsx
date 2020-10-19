import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  StyleProp
} from 'react-native';

import {colors, text, scale} from '../../external-dependencies';

interface TransparentButtonProps {
  onPress: () => void;
  label?: string;
  children?: React.ReactNode;
}

const dimensions = Dimensions.get('screen');

export const TransparentButton: React.FC<TransparentButtonProps> = ({
  onPress,
  label,
  children
}) => {
  const [pressed, setPressed] = useState(false);

  const buttonStyle: StyleProp<ViewStyle> = [styles.button];
  if (pressed) {
    buttonStyle.push({backgroundColor: colors.buttons.empty.shadow});
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={buttonStyle}
        accessibilityRole="button"
        importantForAccessibility="yes"
        activeOpacity={1}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => {
          onPress();
          setPressed(false);
        }}>
        {label && <Text style={styles.text}>{label}</Text>}
        {children}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    minHeight: scale(48),
    justifyContent: 'flex-start'
  },
  button: {
    minHeight: dimensions.scale > 1 ? 44 : 38,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4
  },
  text: {
    ...text.largeBold,
    color: colors.buttons.empty.text,
    textAlign: 'center',
    textAlignVertical: 'center',
    flexWrap: 'wrap'
  }
});

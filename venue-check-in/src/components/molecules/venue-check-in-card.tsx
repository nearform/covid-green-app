import React, {forwardRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import {text, colors, Card} from '../../external-dependencies';
import Icons from '../../assets/index';

interface VenueCheckInCardProps {
  onPress?: () => void;
}

export const VenueCheckInCard = forwardRef<any, VenueCheckInCardProps>(
  ({onPress}, ref) => {
    const {t} = useTranslation();

    return (
      <Card cardRef={ref} onPress={onPress} padding={{r: 4}}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Icons.QRCode width={64} height={64} />
          </View>
          <View style={styles.textContainer}>
            <Text style={text.largeBlack}>{t('venueCheckIn:title')}</Text>
            <Text style={[text.smallBold, {color: colors.teal}]}>
              {t('venueCheckIn:subTitle')}
            </Text>
          </View>
        </View>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  textContainer: {
    flex: 1
  }
});

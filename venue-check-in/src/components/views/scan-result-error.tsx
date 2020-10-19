import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {text, Button, Spacing} from '../../external-dependencies';
import {BasicLayout} from '../templates/basic-layout';
import {ScanResult} from '../templates/scan-result';
import {Header} from '../molecules/header';
import Icons from '../../assets/index';

export const ScanResultError: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const goToMain = () => navigation.navigate('main');
  const goToScanner = () => navigation.navigate('venueCheckIn.scanner');

  return (
    <>
      <Header onClose={goToMain} />
      <BasicLayout>
        <ScanResult
          icon={<Icons.Error width={80} height={80} />}
          content={
            <>
              <Text style={[styles.title, styles.centered]}>
                {t('venueCheckIn:result:error:title')}
              </Text>
              <Spacing s={12} />
              <Text style={[styles.message, styles.centered]}>
                {t('venueCheckIn:result:error:message')}
              </Text>
            </>
          }
          buttons={
            <Button width="100%" onPress={goToScanner}>
              {t('venueCheckIn:result:error:tryAgainButton')}
            </Button>
          }
        />
      </BasicLayout>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    ...text.xlargeBold
  },
  message: {
    ...text.default
  },
  centered: {
    textAlign: 'center'
  }
});

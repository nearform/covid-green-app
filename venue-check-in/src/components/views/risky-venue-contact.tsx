import React, {FC} from 'react';
import {Text, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import PushNotification from 'react-native-push-notification';

import {
  text,
  Button,
  Spacing,
  Scrollable,
  Markdown,
  useSettings
} from '../../external-dependencies';

export const RiskyVenueContact: FC = () => {
  const {t} = useTranslation();
  const {exposedTodo} = useSettings();

  const todoList = exposedTodo;

  PushNotification.setApplicationIconBadgeNumber(0);

  return (
    <Scrollable heading={t('venueCheckIn:riskyVenueContact:title')}>
      <Text style={text.largeBold}>
        {t('venueCheckIn:riskyVenueContact:alertintro')}
      </Text>
      <Spacing s={16} />
      <Text style={text.defaultBold}>
        {t('venueCheckIn:riskyVenueContact:todo:title')}
      </Text>
      <Spacing s={8} />
      <Markdown>{todoList}</Markdown>
      <Spacing s={24} />
      <Text style={text.defaultBold}>
        {t('venueCheckIn:riskyVenueContact:symptoms:title')}
      </Text>
      <Spacing s={8} />
      <Markdown>{t('venueCheckIn:riskyVenueContact:symptoms:intro')}</Markdown>
      <Spacing s={12} />
      <Button
        width="100%"
        onPress={() =>
          Linking.openURL('https://www2.hse.ie/app/in-app-close-contact')
        }>
        {t('venueCheckIn:riskyVenueContact:symptoms:callHSE')}
      </Button>
      <Spacing s={32} />
    </Scrollable>
  );
};

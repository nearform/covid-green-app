This folder contains the implementation of the Venue check-in and QR code parsing feature.

This README describes the initial configuration steps required to integrate this feature in a COVID app:

- [Initial steps](#initial-steps)
- [Update `src/App.tsx`](#update-srcapptsx)
  - [Update react navigation by adding the new `VenueCheckInStack`](#update-react-navigation-by-adding-the-new-venuecheckinstack)
  - [Add support for the new risky venue push notification](#add-support-for-the-new-risky-venue-push-notification)
- [Add the venue check-in card into the Dashboard](#add-the-venue-check-in-card-into-the-dashboard)
- [Add Venue check-in history into Settings](#add-venue-check-in-history-into-settings)
- [Update the debug screen](#update-the-debug-screen)
- [Add translations](#add-translations)

# Initial steps

- Copy the `venue-check-in/` folder into the project.
- Update the import paths in `venue-check-in/src/external-dependencies.tsx`.
- Add the following packages to the `dependencies` section of `package.json`:

  ```JSON
  "@types/jsrsasign": "^8.0.6",
  "@types/jwt-decode": "^2.2.1",
  "jsrsasign": "^10.0.0",
  "jsrsasign-util": "^1.0.0",
  "jwt-decode": "^3.0.0",
  "react-native-aes-crypto": "^1.3.10",
  "react-native-camera": "^3.40.0",
  ```

  - If your project does not support SVG icons, add `react-native-svg-transformer` (version `^0.14.3`) and configure it: https://github.com/kristerkari/react-native-svg-transformer

* Follow the React Native Camera setup steps for iOS: [iOS - other required steps](https://github.com/react-native-camera/react-native-camera/blob/master/docs/installation.md#ios---other-required-steps).

  - Only the `NSCameraUsageDescription` permission is required:

  ```XML
  <key>NSCameraUsageDescription</key>
  <string>This app needs access to your camera in order to check in to venues by scanning official QR codes.</string>
  ```

- Follow the React Native Camera setup steps for Android: [Android - other required steps](https://github.com/react-native-camera/react-native-camera/blob/master/docs/installation.md#android---other-required-steps).

  - Only the `android.permission.CAMERA` permission is required:

  ```XML
  <uses-permission android:name="android.permission.CAMERA" />
  ```

# Update `src/App.tsx`

## Update react navigation by adding the new `VenueCheckInStack`

The navigation configuration must change because a parallel stack for the QR code modal-like screens, must be introduced. The new structure is:

```
RootStack
├── AppStack
└── VenueStack
```

To achieve that, create two new stack navigators:

```typescript
const VenueCheckInStack = createStackNavigator();
const RootStack = createStackNavigator();
```

Add the `VenueStack` function that defines the stack for the QR code scanner screens (check full implementation in `src/App.tsx`):

```typescript
const VenueStack = () => {
  const {t} = useTranslation();
  return (
    <VenueCheckInStack.Navigator
      ...
      <VenueCheckInStack.Screen
        name="venueCheckIn.scanner"
      ...
    </VenueCheckInStack.Navigator>
  );
};
```

Take the `Stack.Navigator` inside the `Navigation` function and extract it in its own function (called `AppStack`):

```typescript
const AppStack: React.FC = ({route}) => {
  const {t} = useTranslation();
  const {initialScreen} = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        cardStyle: {backgroundColor: 'transparent'},
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationEnabled: true,
        header: (props) => <NavBar {...props} />
      }}
      initialRouteName={initialScreen}
      headerMode="float">
      <Stack.Screen
        name="over16"
        component={Over16}
        options={{
          title: t('viewNames:age'),
          header: () => null,
          cardStyle: {backgroundColor: colors.yellow}
        }}
      />
      <Stack.Screen name="under16" component={Under16} />
      ...
      <Stack.Screen
        name="terms"
        component={TermsAndConditions}
        options={{title: t('viewNames:terms')}}
      />
    </Stack.Navigator>
  );
};
```

Add two new screens to `AppStack`:

- the venue history screen to settings;
- the new information page the the risky venue alert;

```typescript
const AppStack: React.FC = ({route}) => {
      ...
      <Stack.Screen
        name="settings.venueHistory"
        component={VenueHistory}
        options={{title: t('viewNames:venueHistory')}}
      />
      <Stack.Screen
        name="riskyVenueContact"
        component={RiskyVenueContact}
        options={{title: t('viewNames:riskyVenueContact')}}
      />
      ...
    </Stack.Navigator>
  );
};
```

Update the `Navigation` function with the new navigation hierarchy:

```typescript
function Navigation({
  notification,
  exposureNotificationClicked,
  riskyVenueNotification,
  setState
}: {
  traceConfiguration: TraceConfiguration;
  notification: PN | null;
  exposureNotificationClicked: Boolean | null;
  riskyVenueNotification: PN | null,
  setState: (value: React.SetStateAction<State>) => void;
}) {
  ...
  return (
    <NavigationContainer
      ref={(e) => {
        navigationRef.current = e;
      }}>
      <Spinner animation="fade" visible={app.loading} />
      <RootStack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardStyle: {backgroundColor: 'transparent'},
          gestureEnabled: true,
          gestureDirection: 'horizontal'
        }}
        headerMode="none"
        mode="modal"
        initialRouteName={'app'}>
        <RootStack.Screen
          name="app"
          component={AppStack}
          initialParams={{initialScreen}}
        />
        <RootStack.Screen name="venueCheckIn" component={VenueStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

## Add support for the new risky venue push notification

Update the `State` interface by adding the new `riskyVenueNotification` field:

```typescript
interface State {
  ...
  exposureNotificationClicked: Boolean | null;
  riskyVenueNotification: PN | null;
}
```

Then update the `App` component, by setting the default value for the new state field:

```typescript
export default function App(props: {
  exposureNotificationClicked: Boolean | null;
}) {
  const [state, setState] = React.useState<State>({
    loading: false,
    notification: null,
    exposureNotificationClicked: props.exposureNotificationClicked,
    riskyVenueNotification: null // <- This one
  });
  ...
```

and by chaning the `PushNotification`'s `onNotification` function:

```typescript
    PushNotification.configure({
      onRegister: function () {},
      onNotification: async function (notification) {
        if (isRiskyVenueNotificaton(notification)) {
          setTimeout(
            () =>
              setState((s) => ({...s, riskyVenueNotification: notification})),
            500
          );
        } else {
          // The old code goes here
          ...
        }
      }
```

Then pass the new `state.riskyVenueNotification` field to the `Navigation` component:

```typescript
return (
<SafeAreaProvider>
  <Base>
    ...
    <Navigation
      riskyVenueNotification={state.riskyVenueNotification}
      ...
    />
    ...
```

# Add the venue check-in card into the Dashboard

In `src/components/views/dashboard.tsx`, add `VenueCheckInCard` between `<CheckInCard>` and `<QuickCheckIn>`:

```typescript
<VenueCheckInCard onPress={() => navigation.navigate('venueCheckIn')} />
<Spacing s={16} />
```

# Add Venue check-in history into Settings

In `src/components/views/settings/index.tsx` add the configuration object for the new entry:

```typescript
{
  id: 'checkIn',
  ...
},
{
  id: 'venueHistory',
  title: t('settings:venueHistory'),
  label: t('settings:venueHistory'),
  hint: t('settings:venueHistoryHint'),
  screen: 'settings.venueHistory'
},
{
  id: 'privacy',
  ...
```

# Update the debug screen

Update the debug screen (`src/components/views/settings/debug.tsx`) by adding a new button to simulate a Risky Venue notification:

```typescript
import {showRiskyVenueNotification} from '../../../../venue-check-in';
...
export const Debug = ({navigation}) => {
  ...
  const checkRiskyVenues = () => {
    showRiskyVenueNotification();
  };
  ...
  return (
    <Basic heading="Debug">
       ...
      <Button type="default" onPress={checkRiskyVenues}>
        Check Risky Venues
      </Button>
  ...
```

# Add translations

Add to `assets/lang/en.json` all the translations under `venueCheckIn` key:
`

```json
{
  ...
  "venueCheckIn": {
    "title": "Venue check-In",
    "subTitle": "Check in to a venue by scanning an official QR code",
    ...
  }
  ...
}
```

And:

```json
"settings": {
  ...
  "venueHistory": "Venue Check-In",
  "venueHistoryHint": "View the Venue Check-In"
},

```

And:

```json
"viewNames": {
  ...
  "venueHistory": "Venue Check-In",
  "riskyVenueContact": "Risky Venue Contact"
  ...
 }
```

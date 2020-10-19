import {Asset} from 'expo-asset';

export const cacheVenueCheckInImages = () => {
  const images = [
    require('../assets/images/close-white/close-white.png'),
    require('../assets/images/delete/delete.png'),
    require('../assets/images/error-mark/error-mark.png'),
    require('../assets/images/qr-code/qr-code.png'),
    require('../assets/images/qr-code-phone/qr-code-phone.png')
  ];
  return images.map((image) => Asset.fromModule(image).downloadAsync());
};

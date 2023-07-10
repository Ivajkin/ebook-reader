import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const PLATFORM_STORAGE_READ_PERMISSIONS = {
  ios: PERMISSIONS.IOS.STOREKIT,
  android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
};

const PLATFORM_STORAGE_WRITE_PERMISSIONS = {
  ios: PERMISSIONS.IOS.STOREKIT,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
};

const REQUEST_PERMISSION_TYPE = {
  camera: PLATFORM_CAMERA_PERMISSIONS,
  storageRead: PLATFORM_STORAGE_READ_PERMISSIONS,
  storageWrite: PLATFORM_STORAGE_WRITE_PERMISSIONS,
};

const PERMISSIONS_TYPE = {
  camera: 'camera',
  storageRead: 'storageRead',
  storageWrite: 'storageWrite',
};

class AppPermission {
  checkPermission = async (type): Promise<boolean> => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];

    if (!permissions) {
      return true;
    }
    try {
      const result = await check(permissions);

      if (result === RESULTS.GRANTED) return true;
      return this.requestsPermission(permissions);
    } catch (error) {
      return false;
    }
  };
  requestsPermission = async (permissions): Promise<boolean> => {
    try {
      const result = await request(permissions);

      return result === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  requestsMultiple = async (types): Promise<boolean> => {
    const results = [];
    for (const type of types) {
      const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
      if (permission) {
        const result = await this.requestsPermission(permission);
        results.push(result);
      }
    }
    for (const result of results) {
      if (!result) {
        return false;
      }
    }
    return true;
  };
}

const Permission = new AppPermission();
export { Permission, PERMISSIONS_TYPE };

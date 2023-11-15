import { ConfigOptions, v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'dic2dqube',
      api_key: '345825913927338',
      api_secret: 'Y73U42IY_biSJIZjFj--cZNq5T0',
    });
  },
};

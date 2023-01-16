export interface AndroidIcon {
  directoryName: string;
  size: number;
}

export const androidManifestFile = 'android/app/src/main/AndroidManifest.xml';

export const getAndroidResDirectory = (flavor?: string) => `android/app/src/${flavor ?? 'main'}/res/`;
export const getAndroidAdaptiveXmlFolder = (flavor?: string) => `${getAndroidResDirectory(flavor)}mipmap-anydpi-v26/`;
export const getAndroidColorsFile = (flavor?: string) => `${getAndroidResDirectory(flavor)}res/values/colors.xml`;

export const isAndroidIconNameCorrectFormat = (iconName: string) => {
  return /^[a-z0-9_]+$/.exec(iconName);
};

export const androidAdaptiveForegroundFileName = 'ic_launcher_foreground';
export const androidAdaptiveBackgroundFileName = 'ic_launcher_background';

export const adaptiveAndroidIcons: AndroidIcon[] = [
  { directoryName: 'drawable-mdpi', size: 108 },
  { directoryName: 'drawable-hdpi', size: 162 },
  { directoryName: 'drawable-xhdpi', size: 216 },
  { directoryName: 'drawable-xxhdpi', size: 324 },
  { directoryName: 'drawable-xxxhdpi', size: 432 },
];

export const androidIcons: AndroidIcon[] = [
  { directoryName: 'mipmap-mdpi', size: 48 },
  { directoryName: 'mipmap-hdpi', size: 72 },
  { directoryName: 'mipmap-xhdpi', size: 96 },
  { directoryName: 'mipmap-xxhdpi', size: 144 },
  { directoryName: 'mipmap-xxxhdpi', size: 192 },
];

export const getRoundedCornersLayer = (size: number) => Buffer.from(
  `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${Math.floor(size / 2)}" ry="${Math.floor(size / 2)}"/></svg>`
);

export const getIcLauncherXml = (iconName?: string) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/${iconName || 'ic_launcher'}_background"/>
    <foreground android:drawable="@drawable/${iconName || 'ic_launcher'}_foreground"/>
</adaptive-icon>
`;

export const getIcLauncherDrawableBackgroundXml = (iconName?: string) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/${iconName || 'ic_launcher'}_background"/>
    <foreground android:drawable="@drawable/${iconName || 'ic_launcher'}_foreground"/>
</adaptive-icon>
`;

export const getColorsXmlTemplate = (iconName?: string) => `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="${iconName || 'ic_launcher'}_background">#FF000000</color>
</resources>
`;

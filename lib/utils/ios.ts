export interface IosIcon {
  name: string;
  size: number;
}

export const iosDefaultIconName = 'Icon-App';

export const getIosDefaultIconFolder = (projectName: string, flavor?: string) => (
  `ios/${projectName}/Images.xcassets/AppIcon${flavor?`-${flavor}`:''}.appiconset/`
);
export const getIosConfigFile = (projectName: string) => `ios/${projectName}.xcodeproj/project.pbxproj`;
export const getIosAssetFolder = (projectName: string) => `ios/${projectName}/Images.xcassets/`;

export const iosIcons: IosIcon[] = [
  { name: '-20x20@1x', size: 20 },
  { name: '-20x20@2x', size: 40 },
  { name: '-20x20@3x', size: 60 },
  { name: '-29x29@1x', size: 29 },
  { name: '-29x29@2x', size: 58 },
  { name: '-29x29@3x', size: 87 },
  { name: '-40x40@1x', size: 40 },
  { name: '-40x40@2x', size: 80 },
  { name: '-40x40@3x', size: 120 },
  { name: '-60x60@2x', size: 120 },
  { name: '-60x60@3x', size: 180 },
  { name: '-76x76@1x', size: 76 },
  { name: '-76x76@2x', size: 152 },
  { name: '-83.5x83.5@2x', size: 167 },
  { name: '-1024x1024@1x', size: 1024 },
];

export const generateContentsFile = (newIconName: string) => ({
  images: createImageList(newIconName),
  info: { version: 1, author: 'xcode' },
});

export const createImageList = (newIconName: string) => {
  return [
    {
      size: '20x20',
      idiom: 'iphone',
      filename: `${newIconName}-20x20@2x.png`,
      scale: '2x'
    },
    {
      size: '20x20',
      idiom: 'iphone',
      filename: `${newIconName}-20x20@3x.png`,
      scale: '3x'
    },
    {
      size: '29x29',
      idiom: 'iphone',
      filename: `${newIconName}-29x29@1x.png`,
      scale: '1x'
    },
    {
      size: '29x29',
      idiom: 'iphone',
      filename: `${newIconName}-29x29@2x.png`,
      scale: '2x'
    },
    {
      size: '29x29',
      idiom: 'iphone',
      filename: `${newIconName}-29x29@3x.png`,
      scale: '3x'
    },
    {
      size: '40x40',
      idiom: 'iphone',
      filename: `${newIconName}-40x40@2x.png`,
      scale: '2x'
    },
    {
      size: '40x40',
      idiom: 'iphone',
      filename: `${newIconName}-40x40@3x.png`,
      scale: '3x'
    },
    {
      size: '60x60',
      idiom: 'iphone',
      filename: `${newIconName}-60x60@2x.png`,
      scale: '2x'
    },
    {
      size: '60x60',
      idiom: 'iphone',
      filename: `${newIconName}-60x60@3x.png`,
      scale: '3x'
    },
    {
      size: '20x20',
      idiom: 'ipad',
      filename: `${newIconName}-20x20@1x.png`,
      scale: '1x'
    },
    {
      size: '20x20',
      idiom: 'ipad',
      filename: `${newIconName}-20x20@2x.png`,
      scale: '2x'
    },
    {
      size: '29x29',
      idiom: 'ipad',
      filename: `${newIconName}-29x29@1x.png`,
      scale: '1x'
    },
    {
      size: '29x29',
      idiom: 'ipad',
      filename: `${newIconName}-29x29@2x.png`,
      scale: '2x'
    },
    {
      size: '40x40',
      idiom: 'ipad',
      filename: `${newIconName}-40x40@1x.png`,
      scale: '1x'
    },
    {
      size: '40x40',
      idiom: 'ipad',
      filename: `${newIconName}-40x40@2x.png`,
      scale: '2x'
    },
    {
      size: '76x76',
      idiom: 'ipad',
      filename: `${newIconName}-76x76@1x.png`,
      scale: '1x'
    },
    {
      size: '76x76',
      idiom: 'ipad',
      filename: `${newIconName}-76x76@2x.png`,
      scale: '2x'
    },
    {
      size: '83.5x83.5',
      idiom: 'ipad',
      filename: `${newIconName}-83.5x83.5@2x.png`,
      scale: '2x'
    },
    {
      size: '1024x1024',
      idiom: 'ios-marketing',
      filename: `${newIconName}-1024x1024@1x.png`,
      scale: '1x'
    }
  ];
};

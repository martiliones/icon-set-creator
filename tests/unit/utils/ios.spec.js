const fs = require('fs-extra');
const path = require('path');

const {
  getProjectName,
  changeIosLauncherIcon
} = require('../../../lib/utils/ios');

const context = path.resolve(__dirname, 'output');

if (fs.existsSync(context)) {
  fs.removeSync(context);
}

fs.mkdirSync(context);

const projectTestName = 'ProjectTestName';
const iconTestName = 'icon_test';

test('Should get project name with directory', () => {
  const projectDir = path.resolve(context, 'ios', projectTestName, 'Images.xcassets');

  fs.mkdirSync(projectDir, { recursive: true });

  const xCodeDir = path.resolve(context, 'ios', `${projectTestName}.xcodeproj`);

  fs.mkdirSync(xCodeDir, { recursive: true });

  fs.writeFileSync(path.resolve(context, 'ios', `Podfile`), '');

  expect(getProjectName(context)).toBe(projectTestName);
});

test('Should get project name with app.json', () => {
  const filePath = path.resolve(context, 'app.json');
  const data = JSON.stringify({
    name: projectTestName
  }, null, 2);

  fs.writeFileSync(filePath, data);

  expect(getProjectName(context)).toBe(projectTestName);
});

test('Should change icon in XCode config file', () => {
  const getConfigFile = (iconApp) => `
/* Begin XCBuildConfiguration section */
  0123456789abcdef1011121314151617 /* Debug */ = {
    isa = XCBuildConfiguration;
    baseConfigurationReference = 12934789120784891237 /* Pods-${projectTestName}-${projectTestName}Tests.debug.xcconfig */;
    buildSettings = {
      BUNDLE_LOADER = "$(TEST_HOST)";
    };
    name = Debug;
  };
  0123456789abcdef1011121314151617 /* Debug */ = {
    isa = XCBuildConfiguration;
    baseConfigurationReference = 1238748137240978234 /* Pods-${projectTestName}-${projectTestName}Tests.debug.xcconfig */;
    buildSettings = {
      ASSETCATALOG_COMPILER_APPICON_NAME = ${iconApp};
      CLANG_ENABLE_MODULES = YES;
    };
    name = Debug;
  };
  0123456789abcdef1011121314151617 /* Release */ = {
    isa = XCBuildConfiguration;
    baseConfigurationReference = 123908412314321234 /* Pods-${projectTestName}-${projectTestName}Tests.release.xcconfig */;
    buildSettings = {
      ASSETCATALOG_COMPILER_APPICON_NAME = ${iconApp};
      CLANG_ENABLE_MODULES = YES;
    };
    name = Release;
  };
  0123456789abcdef1011121314151617 /* Debug */ = {
    isa = XCBuildConfiguration;
    buildSettings = {
      ALWAYS_SEARCH_USER_PATHS = NO;
      CLANG_ANALYZER_LOCALIZABILITY_NONLOCALIZED = YES;
    };
    name = Debug;
  };
/* End XCBuildConfiguration section */
`;

  const configFileDir = path.resolve(context, 'ios', `${projectTestName}.xcodeproj`);
  const configFile = path.resolve(configFileDir, 'project.pbxproj');

  fs.writeFileSync(configFile, getConfigFile('AppIcon'));

  return changeIosLauncherIcon(iconTestName, context, projectTestName).then(() => {
    expect(fs.readFileSync(configFile, 'utf-8')).toBe(getConfigFile(iconTestName));
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configIds = exports.commandIds = exports.isSupportedLanguage = exports.supportedLanguages = exports.extensionId = void 0;
exports.extensionId = 'dryco';
exports.supportedLanguages = [
    'javascript',
    'javascriptreact',
    'typescript',
    'typescriptreact',
];
function isSupportedLanguage(languageId) {
    return exports.supportedLanguages.indexOf(languageId) !== -1;
}
exports.isSupportedLanguage = isSupportedLanguage;
exports.commandIds = {
    _executeCodeAction: `${exports.extensionId}.executeCodeAction`,
    executeCodeMod: `${exports.extensionId}.executeCodeMod`,
    extendSelection: `${exports.extensionId}.extendSelection`,
    shrinkSelection: `${exports.extensionId}.shrinkSelection`,
    reloadCodeMods: `${exports.extensionId}.reloadCodeMods`,
};
exports.configIds = {
    smartExtendFallbackCommand: 'smartExtendFallbackCommand',
    smartShrinkFallbackCommand: 'smartShrinkFallbackCommand',
};
//# sourceMappingURL=const.js.map
// Change the currentEnvironment variable to switch between environments (local, test, production)
const currentEnvironment = 'production';

// Define environment-specific constants (API endpoints, etc.)
const getEnvironmentConfig = () => {
  switch (currentEnvironment) {
    case 'production':
      return {
        APIEndpoint: 'https://api.aiprm.com/api9',
        APIEndpointAPP: 'https://app.aiprm.com/api',
        AppAccountURL: 'https://app.aiprm.com/account',
        AppPricingURL: 'https://app.aiprm.com/pricing',
        AppSignupURL: 'https://app.aiprm.com/claude',
        AppTeamURL: 'https://app.aiprm.com/teams',
      };
    case 'test':
      return {
        APIEndpoint: 'https://test-api.aiprm.com/api9',
        APIEndpointAPP: 'https://test-app.aiprm.com/api',
        AppAccountURL: 'https://test-app.aiprm.com/account',
        AppPricingURL: 'https://test-app.aiprm.com/pricing',
        AppSignupURL: 'https://test-app.aiprm.com/claude',
        AppTeamURL: 'https://test-app.aiprm.com/teams',
      };
    case 'local':
      return {
        APIEndpoint: 'https://dev-api.aiprm.com/api4',
        APIEndpointAPP: 'https://dev-app.aiprm.com/api',
        AppAccountURL: 'https://dev-app.aiprm.com/account',
        AppPricingURL: 'https://dev-app.aiprm.com/pricing',
        AppSignupURL: 'https://dev-app.aiprm.com/claude',
        AppTeamURL: 'https://dev-app.aiprm.com/teams',
      };
    default:
      return {
        APIEndpoint: 'https://api.aiprm.com/api7',
        APIEndpointAPP: 'https://app.aiprm.com/api',
        AppAccountURL: 'https://app.aiprm.com/account',
        AppPricingURL: 'https://app.aiprm.com/pricing',
        AppSignupURL: 'https://app.aiprm.com/claude',
        AppTeamURL: 'https://app.aiprm.com/teams',
      };
  }
};

// Get environment-specific constants
const environmentConfig = getEnvironmentConfig();

// Define global constants based on environment-specific constants
const APIEndpoint = environmentConfig.APIEndpoint;
const APIEndpointAPP = environmentConfig.APIEndpointAPP;
const AppAccountURL = environmentConfig.AppAccountURL;
const AppPricingURL = environmentConfig.AppPricingURL;
const AppSignupURL = environmentConfig.AppSignupURL;
const AppTeamURL = environmentConfig.AppTeamURL;

// Define global constants
const PromptPlaceholder = '[PROMPT]';
const PromptPlaceholder1 = '[PROMPT1]';
const TargetLanguagePlaceholder = '[TARGETLANGUAGE]';
const CrawledTextPlaceholder = '[CRAWLEDTEXT]';
const CrawledSourcePlaceholder = '[CRAWLEDSOURCE]';
const VariablePlaceholder = '[VARIABLE{idx}]';
const VariableDefinition = /\[VARIABLE([1-6]):(.+?)(:.*?)?(:.*?)?\]/g;
const LanguageFeedURL =
  'https://api.aiprm.com/csv/claude.languages-20230119.csv?v=';
const TopicFeedURL = 'https://api.aiprm.com/csv/claude.topics-20230123.csv?v=';
const ActivityFeedURL =
  'https://api.aiprm.com/csv/claude.activities-20230124.csv?v=';
const ToneFeedURL = 'https://api.aiprm.com/csv/claude.tones-v2-20230216.csv?v=';
const WritingStyleFeedURL =
  'https://api.aiprm.com/csv/claude.writing_styles-v2-20230216.csv?v=';
const ContinueActionsFeedURL =
  'https://api.aiprm.com/csv/claude.continue_actions-20230216.csv?v=';
const ModelFeedURL = 'https://api.aiprm.com/csv/claude.models-20240626.csv?v=';
const PromptBuilderFeedURL =
  'https://api.aiprm.com/csv/claude.prompt_builder-20230811.csv?v=';
const AppShort = 'AIPRM';
const AppName = 'AIPRM for Claude';
const AppSlogan = 'AIPRM - Claude Prompts';
const AppSloganPremium = 'AIPRM Premium - Claude Prompts';
const AppURL =
  'https://www.aiprm.com/?via=claude&utm_campaign=powered&utm_source=claude&utm_medium=navlink&utm_content=AIPRMpowered';
const ExportFilePrefix = 'AIPRM-export-claude-thread_';
const ExportHeaderPrefix =
  '\n```\nExported with AIPRM https://www.aiprm.com by ';
const AppCommunityForumURL =
  'https://forum.aiprm.com/categories?via=claude&utm_campaign=community&utm_source=claude&utm_medium=navlink&utm_content=AIPRMcommunity';
const QuotaMessagesURL =
  'https://api.aiprm.com/json/claude.quota-messages-20240626.json?v=';
const ConfigURL = 'https://api.aiprm.com/json/claude.config-20250328.json?v=';
const AuxIndexLookupDefinition = /^\$\[(\w+::)?(\w+)(\(\d+\))?:([^\n]+)\]$/gm;
const QuickStartOnboardingURL =
  'https://api.aiprm.com/img/claude.quick-start-onboarding.png';
const QuickStartOnboardingDarkURL =
  'https://api.aiprm.com/img/claude.quick-start-onboarding-dark.png';
const QuickStartTutorialURL =
  'https://www.aiprm.com/tutorials/quick-start-guide/how-to-run-your-first-prompt/';
const TutorialsURL = 'https://www.aiprm.com/tutorials/';

const ValidateVariableMaxCount = 6;
const ValidateVariablePlaceholder = /\[VARIABLE([0-9]+)\]/g;
const ValidateVariableDefinition = /\[VARIABLE([0-9]+):(.+?)(:.*?)?(:.*?)?\]/g;

const MaxSeenMessages = 10;

const FixPromptPlaceholder = /\[PROMPT\]/gi;
const FixPromptPlaceholder1 = /\[PROMPT1\]/gi;
const FixTargetLanguagePlaceholder = /\[TARGETLANGUAGE\]/gi;
const FixCrawledTextPlaceholder = /\[CRAWLEDTEXT\]/gi;
const FixCrawledSourcePlaceholder = /\[CRAWLEDSOURCE\]/gi;
const FixVariablePlaceholder = /\[VARIABLE([0-9]+)\]/gi;
const FixVariablePlaceholderReplacement = '[VARIABLE$1]';
const FixVariableDefinition = /\[VARIABLE([1-6]):/gi;
const FixVariableDefinitionReplacement = '[VARIABLE$1:';

export {
  PromptPlaceholder,
  PromptPlaceholder1,
  TargetLanguagePlaceholder,
  CrawledTextPlaceholder,
  CrawledSourcePlaceholder,
  VariablePlaceholder,
  VariableDefinition,
  LanguageFeedURL,
  AppShort,
  AppName,
  AppSlogan,
  AppSloganPremium,
  AppURL,
  ExportFilePrefix,
  ExportHeaderPrefix,
  APIEndpoint,
  TopicFeedURL,
  ActivityFeedURL,
  ToneFeedURL,
  WritingStyleFeedURL,
  ContinueActionsFeedURL,
  ModelFeedURL,
  PromptBuilderFeedURL,
  APIEndpointAPP,
  AppAccountURL,
  AppCommunityForumURL,
  AppPricingURL,
  AppSignupURL,
  QuotaMessagesURL,
  ConfigURL,
  AppTeamURL,
  ValidateVariableMaxCount,
  ValidateVariablePlaceholder,
  ValidateVariableDefinition,
  AuxIndexLookupDefinition,
  MaxSeenMessages,
  QuickStartOnboardingURL,
  QuickStartOnboardingDarkURL,
  QuickStartTutorialURL,
  TutorialsURL,
  FixPromptPlaceholder,
  FixPromptPlaceholder1,
  FixTargetLanguagePlaceholder,
  FixCrawledTextPlaceholder,
  FixCrawledSourcePlaceholder,
  FixVariablePlaceholder,
  FixVariablePlaceholderReplacement,
  FixVariableDefinition,
  FixVariableDefinitionReplacement,
};

/** @typedef {{Enabled: boolean, Config: {APIEndpointURL: string, MaxCharacters: number, MaxWords: number, CrawledTextPrompt: string, CrawledSourcePrompt: string}}} LiveCrawlingConfig */

/** @typedef {{Enabled: boolean, Config: {Selectors: Object.<string, string>}} WatermarkConfig */

/** @typedef {{Config: {ContentTypeText: string, ContentTypeToolUse: string, ContentTypeToolResult: string, ContentTypeThinking: string, ToolNameArtifacts: string, ToolNameREPL: string, ToolNameWebSearch: string, ArtifactsUpdateCommand: string}}} ExportConfig */

/**
 * @typedef {Object} SelectorConfig
 * @property {string} FirstPrompt
 * @property {string} FirstPromptButtons
 * @property {string} ChatLogContainer
 * @property {string} ConversationUserWrapper
 * @property {string} ConversationResponseWrapper
 * @property {string} DashboardTitle
 * @property {string} DashboardTitleTagName
 * @property {string} DashboardTitleUpgrade
 * @property {string} Sidebar
 * @property {string} SidebarButton
 * @property {string} ClaudeSidebar
 * @property {string} ClaudeSidebarClose
 * @property {string} ExportButton
 * @property {string} ExportButtonChatStarted
 * @property {string} PromptTextarea
 * @property {string} PromptTextareaInput
 * @property {string} PromptTextareaInputClass
 * @property {string} PromptSubmitButton
 * @property {string} NewChatSidebar
 * @property {string} NewChatSidebarButton
 * @property {string} NewChatSidebarButtonText
 * @property {string} NewChatTopbar
 * @property {string} NewChatTopbarButton
 * @property {string} NewChatWidgetButtons
 * @property {string} ElementAddedSidebarID1
 * @property {string} ElementAddedSidebarID2
 * @property {string} ElementAddedSidebarClassList
 * @property {string} ElementAddedExportButtonDisable
 * @property {string} ElementAddedExportButtonEnable
 * @property {string} ElementAddedSavePromptAsTemplate
 * @property {string} ElementAddedPromptTemplatesSidebar
 * @property {string} ElementAddedPromptTextarea
 * @property {string} LangWrapperSpacer
 * @property {string} SavePromptAsTemplatePromptText
 * @property {string[]} ElementAddedIgnore
 * @property {string[]} IgnoreByParentID
 * @property {string[]} IgnoreByParentClassPrefix
 * @property {string[]} IgnoreByElementClassPrefix
 * @property {string[]} IgnoreByTag
 * @property {boolean} IgnoreElementsWithoutIdentifiers
 * @property {string} ConversationUserMessages
 * @property {string} ReactFiberPropertyKey
 * @property {string} MessageSenderUser
 * @property {string} NewUserMessageUUID
 * @property {string} AccountSidebarButton
 * @property {string} ResponseButtonsBlock
 */

/** @typedef {{Selector: string, Add: string[], Remove: string[]}} LayoutChangeConfig */

/** @typedef {{PromptTemplates: LayoutChangeConfig[], General: LayoutChangeConfig[]}} LayoutChangesConfig */

/** @typedef {{Enabled: boolean, Config: {EndpointConversation: string, EndpointConversationChatMessages: string, UnselectPromptOnURLChange: boolean, EnablePromptSendQuota: boolean, EnableConversationMessagesModification: boolean, PromptSubmitPathnamePattern: string, FixPlaceholders: boolean, EnableExportChatV2: boolean, OverrideNewChatWidget: boolean}}} PromptTemplatesConfig */

/** @typedef {{Title: string, NoOffer: string, MaxRedemptions: string, NewFeatureBadge: string}} ReferralsConfig */

/** @typedef {{Enabled: boolean}} PromptPanelConfig */

/** @typedef {{Features: {LiveCrawling: LiveCrawlingConfig, Watermark: WatermarkConfig, PromptTemplates: PromptTemplatesConfig, Referrals: ReferralsConfig, PromptPanel: PromptPanelConfig, Export: ExportConfig}, PatternOperatorERID: string, Selectors: SelectorConfig, LayoutChanges: LayoutChangesConfig, NewPromptDefaultText: string}} RemoteConfig */

export class Config {
  /** @type {RemoteConfig} */
  #config;

  /** @param {RemoteConfig} config */
  constructor(config) {
    this.#config = config;
  }

  /** @returns {boolean} */
  isLiveCrawlingEnabled() {
    return this.#config.Features.LiveCrawling.Enabled === true;
  }

  /** @returns {LiveCrawlingConfig['Config']} */
  getLiveCrawlingConfig() {
    return this.#config.Features.LiveCrawling.Config;
  }

  /** @returns {boolean} */
  arePromptTemplatesEnabled() {
    return this.#config.Features.PromptTemplates.Enabled === true;
  }

  /** @returns {PromptTemplatesConfig['Config']} */
  getPromptTemplatesConfig() {
    return this.#config.Features.PromptTemplates.Config;
  }

  /** @returns {boolean} */
  isWatermarkEnabled() {
    return this.#config.Features.Watermark.Enabled === true;
  }

  /** @returns {WatermarkConfig['Config']} */
  getWatermarkConfig() {
    return this.#config.Features.Watermark.Config;
  }

  /** @returns {ReferralsConfig} */
  getReferralsConfig() {
    return this.#config.Features.Referrals;
  }

  /** @returns {string} */
  getPatternOperatorERID() {
    return this.#config.PatternOperatorERID;
  }

  /** @returns {SelectorConfig} */
  getSelectorConfig() {
    return this.#config.Selectors;
  }

  /** @returns {LayoutChangesConfig} */
  getLayoutChangesConfig() {
    return this.#config.LayoutChanges;
  }

  // boolean isPromptPanelEnabled() {
  /** @returns {boolean} */
  isPromptPanelEnabled() {
    return this.#config.Features.PromptPanel.Enabled === true;
  }

  /** @returns {NewPromptDefaultText} */
  getNewPromptDefaultText() {
    return this.#config.NewPromptDefaultText;
  }

  isPromptSendQuotaEnabled() {
    return (
      this.#config.Features.PromptTemplates.Config.EnablePromptSendQuota ===
      true
    );
  }

  /** @returns {ExportConfig['Config']} */
  getExportConfig() {
    return this.#config.Features.Export.Config;
  }
}

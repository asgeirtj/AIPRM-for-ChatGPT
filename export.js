import { ExportFilePrefix, ExportHeaderPrefix } from './config.js';

/**
 * The Exporter class provides functionality to export the current chat as a markdown file.
 *
 * It includes methods to generate markdown content, process chat blocks, and handle different types of messages and additional content.
 */
export class Exporter {
  /** @type {import('./config.js').ExportConfig['Config']} */
  ExportConfig = null;

  /** @param {import('./config.js').Config} config */
  constructor(config) {
    this.Config = config;
    this.ExportConfig = config.getExportConfig();
  }

  /**
   * Exports the current chat as a markdown file.
   */
  exportCurrentChat() {
    const markdown = this.generateMarkdown();

    if (!markdown) {
      return;
    }

    const header = this.createHeader();

    this.downloadMarkdown(header + '\n\n\n' + markdown.join('\n\n---\n\n'));
  }

  /**
   * Generates markdown from chat blocks.
   *
   * @returns {Array<string>} An array of markdown strings generated from chat blocks.
   */
  generateMarkdown() {
    const enableExportChatV2 =
      this.Config.getPromptTemplatesConfig().EnableExportChatV2;

    const selectorConfig = this.Config.getSelectorConfig();

    const blocks = this.getChatBlocks(selectorConfig.ChatLogContainer);

    let markdown = blocks.map((block) =>
      this.processBlock(block, selectorConfig, enableExportChatV2)
    );

    return markdown.filter((b) => b);
  }

  /**
   * Retrieves all child elements (chat blocks) from containers matching the specified selector.
   *
   * @param {string} containerSelector - The CSS selector for the containers.
   * @returns {HTMLElement[]} An array of child elements from the matched containers.
   */
  getChatBlocks(containerSelector) {
    return [...document.querySelector(containerSelector).children];
  }

  /**
   * Processes a block element based on the provided selector configuration and export version.
   *
   * @param {HTMLElement} block - The block element to process.
   * @param {import('./config.js').SelectorConfig} selectorConfig - The configuration object containing selector strings.
   * @param {boolean} enableExportChatV2 - Flag to determine whether to use the new export version (V2) or the old export version.
   * @returns {string} The processed block content as a string.
   */
  processBlock(block, selectorConfig, enableExportChatV2) {
    // new export
    if (enableExportChatV2) {
      return this.processV2Block(block, selectorConfig);
    }

    // old export
    return this.processOldBlock(block, selectorConfig);
  }

  /**
   * Processes a V2 block by selecting all response parts based on the provided selector configuration.
   *
   * @param {HTMLElement} block - The block element containing the responses to be processed.
   * @param {import('./config.js').SelectorConfig} selectorConfig - The configuration object containing the selectors for extracting responses.
   * @returns {string} A string containing the extracted messages, joined by a delimiter.
   */
  processV2Block(block, selectorConfig) {
    return this.extractMessage(block, selectorConfig);
  }

  /**
   * Extracts the message text from a React component wrapper based on the provided selector configuration.
   *
   * @param {HTMLElement} wrapper - The React component wrapper containing the message.
   * @param {import('./config.js').SelectorConfig} selectorConfig - Configuration object containing the React Fiber property key.
   * @returns {string} The extracted and formatted message text. Returns an empty string if the React Fiber property or props are not found.
   */
  extractMessage(wrapper, selectorConfig) {
    // find React props
    const reactFiberKey = Object.keys(wrapper).find((key) =>
      key?.includes(selectorConfig.ReactFiberPropertyKey)
    );

    // no React Fiber property found in the message - return empty string (we can't extract the message)
    if (!reactFiberKey) {
      console.error('Failed to find React Fiber property in the message');
      return '';
    }

    const props =
      wrapper?.[reactFiberKey]?.return?.memoizedProps?.message ?? null;

    // no props found in the message - return empty string (we can't extract the message)
    if (!props) {
      console.error('Failed to find props in the message');
      return '';
    }

    // find message text
    let text = this.getMessageText(props);

    // format message text
    return this.formatMessage(props, text);
  }

  /**
   * Processes the message text by formatting the content parts.
   *
   * @param {Object} props - The properties object containing display parts.
   * @returns {string} - The processed message text with citations removed and parts formatted.
   */
  getMessageText(props) {
    const contentParts = props?.content ?? [];

    // Helper function to parse text as JSON when possible
    const parseAsJSON = (rawText) => {
      try {
        return JSON.parse(rawText);
      } catch {
        return rawText; // Fallback to plain string if not valid JSON
      }
    };

    return contentParts
      .map((part) => {
        const { type, name, input, content, text } = part || {};

        // --- 1) Handle "tool_use" ---
        if (type === this.ExportConfig.ContentTypeToolUse) {
          if (name === this.ExportConfig.ToolNameArtifacts) {
            // Check for "command=update"
            const command = input?.command ?? '';

            if (command === this.ExportConfig.ArtifactsUpdateCommand) {
              const artifactId = input?.id ?? '';
              const newStr = input?.new_str ?? '';
              const oldStr = input?.old_str ?? '';
              return `**Tool Use: ${name} (update)**\n\`\`\`\nid: ${artifactId}\nold string: ${oldStr}\nnew string: ${newStr}\n\`\`\``;
            }

            // Otherwise, pick code block language based on input.type
            // e.g. "application/vnd.ant.mermaid" => "mermaid"
            const codeType = input?.type ?? 'plaintext';
            const language = codeType.split('.').pop() || 'plaintext';
            const codeSnippet = input?.content ?? '';

            return `**Tool Use: ${name}**\n\`\`\`${language}\n${codeSnippet}\n\`\`\``;
          }

          // Web search tool query
          if (name === this.ExportConfig.ToolNameWebSearch) {
            const query = input?.query ?? '';
            return `**Tool Use: ${name}**\n\`\`\`\n${query}\n\`\`\``;
          }

          // Fallback if it's not "artifacts"
          const codeSnippet = input?.code ?? input?.content ?? '';
          const language =
            name === this.ExportConfig.ToolNameREPL ? 'javascript' : '';
          return `**Tool Use: ${name}**\n\`\`\`${language}\n${codeSnippet}\n\`\`\``;
        }

        // --- 2) Handle "tool_result" ---
        else if (type === this.ExportConfig.ContentTypeToolResult) {
          // 2a) Skip "tool_result: artifacts" entirely (only status)
          if (name === this.ExportConfig.ToolNameArtifacts) {
            return '';
          }

          // 2b) Special handling for "repl"
          if (name === this.ExportConfig.ToolNameREPL) {
            // Each content[].text can be JSON or plain text
            const lines = [];

            content
              ?.filter(
                (item) => item?.type === this.ExportConfig.ContentTypeText
              )
              ?.forEach((item) => {
                const itemParsed = parseAsJSON(item.text ?? '');

                if (typeof itemParsed === 'object' && itemParsed !== null) {
                  const status = itemParsed?.status
                    ? `Status: ${itemParsed.status}\n`
                    : '';

                  const logs = Array.isArray(itemParsed.logs)
                    ? itemParsed.logs.join('\n')
                    : '';

                  let logText = logs ? `\n${logs}` : '';
                  lines.push(`${status}${logText}`);
                } else {
                  lines.push(itemParsed);
                }
              });

            const output = lines.join('\n');
            return `**Tool Result: ${name}**\n\`\`\`\n${output}\n\`\`\``;
          }

          // 2c) Special handling for "web_search"
          if (name === this.ExportConfig.ToolNameWebSearch) {
            const results = content.map((item) => {
              const title = item?.title ?? '';
              const url = item?.url ?? '';

              // Check if title and url are valid
              if (!title || !url) {
                return '';
              }

              return `- ${title} (${url})`;
            });

            return `**Tool Result: ${name}**\n\`\`\`\n${results.join(
              '\n'
            )}\n\`\`\``;
          }

          // 2d) Fallback for other "tool_result" names
          const textContent =
            content
              ?.filter(
                (item) => item?.type === this.ExportConfig.ContentTypeText
              )
              ?.map((item) => {
                const parsed = parseAsJSON(item.text ?? '');

                return typeof parsed === 'object' && parsed !== null
                  ? JSON.stringify(parsed, null, 2)
                  : parsed;
              })
              .join('\n') ?? '';

          return `**Tool Result: ${name}**\n\`\`\`\n${textContent}\n\`\`\``;
        }

        // --- 3) Handle "thinking" ---
        else if (type === this.ExportConfig.ContentTypeThinking) {
          return `**Thinking:**\n${
            part?.thinking
              ?.split('\n')
              ?.map((line) => '> ' + line)
              ?.join('\n') || ''
          }\n`;
        }

        // --- 4) Handle other content types (not plain text) ---
        else if (type && type !== this.ExportConfig?.ContentTypeText) {
          return `**${type}: ${name || ''}**\n\`\`\`\n${text || ''}\n\`\`\``;
        }

        // --- 5) Handle text with citations ---
        if (part.citations?.length) {
          let textWithCitations = text || '';

          // Group citations by their marker (start_index and end_index)
          const groupedCitations = Object.values(
            part.citations.reduce((groups, citation) => {
              // Verify citation has start_index and end_index + url and site_name
              if (
                !citation.start_index ||
                !citation.end_index ||
                !citation.url ||
                !citation.metadata?.site_name
              ) {
                return groups;
              }

              const key = `${citation.start_index}-${citation.end_index}`;

              if (!groups[key]) {
                groups[key] = {
                  start_index: citation.start_index,
                  end_index: citation.end_index,
                  items: [],
                };
              }

              groups[key].items.push(
                `([${citation.metadata.site_name}](${citation.url}))`
              );

              return groups;
            }, {})
          );

          // Sort groups in descending order by the insertion index (using end_index)
          groupedCitations.sort((a, b) => b.end_index - a.end_index);

          // Process each group and insert the inline citation text after the marker
          groupedCitations.forEach((group) => {
            const inlineCitation = ' ' + group.items.join(' ');

            // Insert inline citation text after the marker without replacing it.
            // Using group.end_index ensures the original marker remains intact.
            textWithCitations =
              textWithCitations.slice(0, group.end_index) +
              inlineCitation +
              textWithCitations.slice(group.end_index);
          });

          return textWithCitations || '';
        }

        // --- 6) Default to plain text if none of the above applies ---
        return text || '';
      })
      .join('\n');
  }

  /**
   * Formats a message with author and timestamp.
   *
   * @param {Object} props - The properties object.
   * @param {string} text - The text of the message to format.
   * @returns {string} The formatted message string.
   */
  formatMessage(props, text) {
    const author = props?.sender === 'human' ? 'User' : 'Claude';

    const createTime = props?.created_at ? ` (${props?.created_at})` : '';

    // formatted message as "Author (Timestamp): Message"
    return `**${author}${createTime}:**\n` + text;
  }

  /**
   * Processes an old message block and formats it based on whether it is a user's message or an assistant's message.
   *
   * @param {HTMLElement} wrapper - The HTML element containing the message block.
   * @param {import('./config.js').SelectorConfig} selectorConfig - Configuration object containing CSS selectors.
   * @returns {string} - Formatted message string indicating whether it is from the user or the assistant.
   */
  processOldBlock(block, selectorConfig) {
    let userMessageWrapper = block.querySelector(
      selectorConfig.ConversationUserWrapper
    );
    if (userMessageWrapper) {
      return '**User:**\n' + userMessageWrapper.innerText;
    }

    let responseWrapper = block.querySelector(
      selectorConfig.ConversationResponseWrapper
    );
    if (!responseWrapper) {
      return '';
    }

    // pass this point is assistant's message
    const assistantWrapper = responseWrapper.firstChild;

    return (
      '**Claude:**\n' +
      [...assistantWrapper.children]
        .map((node) => this.formatOldMessage(node))
        .join('\n')
    );
  }

  /**
   * Formats the content of a given DOM node into a string.
   *
   * If the node is a <pre> element, it extracts the programming language from the
   * class of the <code> element inside it and formats the content as a code block.
   * Otherwise, it returns the inner HTML of the node.
   *
   * @param {HTMLElement} node - The DOM node to format.
   * @returns {string} The formatted content of the node.
   */
  formatOldMessage(node) {
    let language;

    if (node.nodeName === 'PRE') {
      language =
        node.getElementsByTagName('code')[0]?.classList[2]?.split('-')[1] || '';

      return `\`\`\`${language}\n${node.innerText
        .replace(/^.*\n?Copy code/g, '')
        .trim()}\n\`\`\``;
    }

    return `${node.innerHTML}`;
  }

  /**
   * Creates a header string containing user information and the current date and time.
   *
   * @returns {string} The constructed header string.
   */
  createHeader() {
    let header = '';

    try {
      header =
        ExportHeaderPrefix +
        window.AIPRM.Client.ClaudeUser?.FullName +
        ' on ' +
        new Date().toLocaleString() +
        '\n```\n\n---';
    } catch {
      console.error('Failed to get user name. Using default header instead.');
    }

    return header;
  }

  /**
   * Downloads the given content as a Markdown (.md) file.
   *
   * @param {string} content - The content to be downloaded as a Markdown file.
   */
  downloadMarkdown(content) {
    const blob = new Blob([content], { type: 'text/plain' });

    const a = document.createElement('a');

    a.href = URL.createObjectURL(blob);
    a.download = ExportFilePrefix + new Date().toISOString() + '.md';

    document.body.appendChild(a);

    a.click();
  }
}

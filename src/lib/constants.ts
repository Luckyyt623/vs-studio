export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'cpp', label: 'C++ (Preview)' },
  { value: 'plaintext', label: 'Plain Text' },
];

export const DEFAULT_LANGUAGE = 'javascript';
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_EDITOR_THEME = 'dark'; // For editor component specific theme
export const DEFAULT_INDENTATION = 2; // Number of spaces

export type EditorTheme = 'dark' | 'light';

export const INDENTATION_OPTIONS = [
  { value: 2, label: '2 Spaces' },
  { value: 4, label: '4 Spaces' },
];


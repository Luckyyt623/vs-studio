
"use client";

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  SUPPORTED_LANGUAGES,
  INDENTATION_OPTIONS,
  type EditorTheme,
} from '@/lib/constants';
import { Languages, ALargeSmall, Palette, Pilcrow } from 'lucide-react';

interface SettingsPanelProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  editorTheme: EditorTheme;
  onEditorThemeChange: (theme: EditorTheme) => void;
  indentation: number;
  onIndentationChange: (indent: number) => void;
}

export function SettingsPanel({
  language,
  onLanguageChange,
  fontSize,
  onFontSizeChange,
  editorTheme,
  onEditorThemeChange,
  indentation,
  onIndentationChange,
}: SettingsPanelProps) {
  return (
    <div className="space-y-6"> {/* Remove p-1 */}
      <div>
        <Label htmlFor="language-select" className="flex items-center mb-2 text-sm font-medium">
          <Languages className="w-4 h-4 mr-2" /> Language
        </Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger id="language-select" className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="font-size-slider" className="flex items-center mb-2 text-sm font-medium">
          <ALargeSmall className="w-4 h-4 mr-2" /> Font Size: {fontSize}px
        </Label>
        <Slider
          id="font-size-slider"
          min={8}
          max={32}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => onFontSizeChange(value[0])}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="indentation-select" className="flex items-center mb-2 text-sm font-medium">
          <Pilcrow className="w-4 h-4 mr-2" /> Indentation
        </Label>
        <Select value={String(indentation)} onValueChange={(val) => onIndentationChange(Number(val))}>
          <SelectTrigger id="indentation-select" className="w-full">
            <SelectValue placeholder="Select indentation" />
          </SelectTrigger>
          <SelectContent>
            {INDENTATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="theme-switch" className="flex items-center text-sm font-medium">
          <Palette className="w-4 h-4 mr-2" /> Editor Dark Theme
        </Label>
        <Switch
          id="theme-switch"
          checked={editorTheme === 'dark'}
          onCheckedChange={(checked) => onEditorThemeChange(checked ? 'dark' : 'light')}
        />
         <span className="sr-only">Toggle editor theme between dark and light</span>
      </div>
    </div>
  );
}

    
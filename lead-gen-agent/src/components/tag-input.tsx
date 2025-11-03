'use client';

import type { KeyboardEvent } from "react";
import { useState } from "react";

interface TagInputProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
  helperText?: string;
  addOnBlur?: boolean;
}

export const TagInput = ({
  label,
  placeholder,
  values,
  onChange,
  helperText,
  addOnBlur = true,
}: TagInputProps) => {
  const [buffer, setBuffer] = useState("");

  const handleAdd = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (values.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) {
      setBuffer("");
      return;
    }
    onChange([...values, trimmed]);
    setBuffer("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === "Tab") {
      event.preventDefault();
      handleAdd(buffer);
    }
    if (event.key === "Backspace" && !buffer.length && values.length) {
      event.preventDefault();
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    const next = [...values];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-400 focus-within:shadow-md">
        {values.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="rounded-full p-0.5 text-xs text-indigo-500 transition hover:bg-indigo-100"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 min-w-[120px] border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder={placeholder}
          value={buffer}
          onChange={(event) => setBuffer(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (addOnBlur) {
              handleAdd(buffer);
            }
          }}
        />
      </div>
      {helperText && <span className="text-xs text-slate-500">{helperText}</span>}
    </label>
  );
};

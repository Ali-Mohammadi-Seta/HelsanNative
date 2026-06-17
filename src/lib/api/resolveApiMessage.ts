type MessageLanguage = 'fa' | 'en';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const cleanString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const readPath = (source: unknown, path: string[]): unknown => {
  let current = source;
  for (const key of path) {
    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
};

const flattenMessage = (value: unknown): string | null => {
  const direct = cleanString(value);
  if (direct) return direct;

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => flattenMessage(item))
      .filter(Boolean) as string[];
    return parts.length ? parts.join('\n') : null;
  }

  if (isRecord(value)) {
    const preferred = [
      value.messageFa,
      value.message,
      value.messageEn,
      value.title,
      value.detail,
      value.errorMessage,
      value.description,
    ];

    for (const item of preferred) {
      const result = flattenMessage(item);
      if (result) return result;
    }
  }

  return null;
};

export const resolveApiMessage = (
  source: unknown,
  fallback: string,
  language: MessageLanguage = 'fa',
): string => {
  const payload = readPath(source, ['response', 'data']) ?? source;
  const preferredPaths =
    language === 'fa'
      ? [
          ['messageFa'],
          ['message'],
          ['error', 'messageFa'],
          ['error', 'message'],
          ['data', 'messageFa'],
          ['data', 'message'],
          ['messageEn'],
          ['error', 'messageEn'],
        ]
      : [
          ['messageEn'],
          ['message'],
          ['error', 'messageEn'],
          ['error', 'message'],
          ['data', 'messageEn'],
          ['data', 'message'],
          ['messageFa'],
          ['error', 'messageFa'],
        ];

  for (const path of preferredPaths) {
    const result = flattenMessage(readPath(payload, path));
    if (result) return result;
  }

  return flattenMessage(payload) ?? fallback;
};

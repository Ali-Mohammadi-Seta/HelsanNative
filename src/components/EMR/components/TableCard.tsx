// src/components/EMR/components/TableCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { Ionicons } from '@expo/vector-icons';

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => string | React.ReactNode;
  flex?: number;
}

interface TableCardProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
}

const readableKeys = ['srvName', 'serviceName', 'name', 'title', 'label', 'value', 'description'];

const toDisplayText = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) {
    const joined = value.map(toDisplayText).filter((item) => item !== '-').join('، ');
    return joined || '-';
  }
  if (React.isValidElement(value)) return '-';
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    for (const key of readableKeys) {
      const nestedValue = record[key];
      if (nestedValue !== null && nestedValue !== undefined && nestedValue !== '') {
        return toDisplayText(nestedValue);
      }
    }
    return '-';
  }
  return String(value);
};

function TableCard<T>({ columns, data, keyExtractor }: TableCardProps<T>) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  if (!data.length) return null;

  return (
    <View style={styles.list}>
      {data.map((item, index) => {
        const [primaryColumn, ...detailColumns] = columns;
        const primaryRawValue = primaryColumn ? (item as any)[primaryColumn.key as string] : undefined;
        const primaryValue = primaryColumn?.render
          ? primaryColumn.render(primaryRawValue, item)
          : primaryRawValue;
        const primaryText = toDisplayText(primaryValue);

        return (
          <View
            key={keyExtractor(item, index)}
            style={[
              styles.recordCard,
              {
                backgroundColor: isDark ? colors.surface : '#f8fafc',
                borderColor: isDark ? colors.border : '#e5e7eb',
              },
            ]}
          >
            {primaryColumn && (
              <View
                style={[
                  styles.recordHeader,
                  { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
                ]}
              >
                <View
                  style={[
                    styles.recordIcon,
                    { backgroundColor: `${colors.primary}18` },
                  ]}
                >
                  <Ionicons name="document-text-outline" size={17} color={colors.primary} />
                </View>
                <View style={[direction.startItems, { flex: 1 }]}>
                  <Text
                    style={[
                      styles.primaryLabel,
                      {
                        color: colors.textSecondary,
                        textAlign: direction.textAlign,
                        writingDirection: direction.dir,
                      },
                    ]}
                  >
                    {primaryColumn.title}
                  </Text>
                  <Text
                    style={[
                      styles.primaryValue,
                      {
                        color: colors.text,
                        textAlign: direction.textAlign,
                        writingDirection: direction.dir,
                      },
                    ]}
                  >
                    {primaryText}
                  </Text>
                </View>
              </View>
            )}

            <View
              style={[
                styles.detailGrid,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              {detailColumns.map((col) => {
                const rawValue = (item as any)[col.key as string];
                const rendered = col.render ? col.render(rawValue, item) : rawValue;
                const renderedText = toDisplayText(rendered);

                return (
                  <View
                    key={String(col.key)}
                    style={[
                      styles.detailItem,
                      {
                        backgroundColor: isDark ? colors.card : '#ffffff',
                        borderColor: isDark ? colors.border : '#edf2f7',
                      },
                      direction.startItems,
                    ]}
                  >
                    <Text
                      style={[
                        styles.detailLabel,
                        {
                          color: colors.textSecondary,
                          textAlign: direction.textAlign,
                          writingDirection: direction.dir,
                        },
                      ]}
                    >
                      {col.title}
                    </Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color: colors.text,
                          textAlign: direction.textAlign,
                          writingDirection: direction.dir,
                        },
                      ]}
                    >
                      {renderedText}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  recordCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  recordHeader: {
    alignItems: 'flex-start',
    gap: 10,
  },
  recordIcon: {
    alignItems: 'center',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  primaryLabel: {
    fontFamily: 'IRANSans',
    fontSize: 10,
    lineHeight: 16,
  },
  primaryValue: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
    lineHeight: 23,
    marginTop: 2,
  },
  detailGrid: {
    flexWrap: 'wrap',
    gap: 8,
  },
  detailItem: {
    borderRadius: 10,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 120,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  detailLabel: {
    fontFamily: 'IRANSans',
    fontSize: 10,
    lineHeight: 15,
  },
  detailValue: {
    fontFamily: 'IRANSans-Medium',
    fontSize: 12,
    lineHeight: 20,
    marginTop: 2,
  },
});

export default TableCard;

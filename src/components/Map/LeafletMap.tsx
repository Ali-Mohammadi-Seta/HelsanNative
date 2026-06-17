import { useDirection } from '@/lib/hooks/useDirection';
import { useTheme } from '@/styles/theme';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

let WebViewComponent: typeof import('react-native-webview').WebView | null = null;
let webViewAvailable = true;

try {
  WebViewComponent = require('react-native-webview').WebView;
} catch {
  console.log('WebView native module not available - use a development build for full functionality');
  webViewAvailable = false;
}

interface LocationItem {
  _id: string;
  category: string;
  name: string;
  title: string;
  address: string;
  location: {
    lat: number;
    lon: number;
  };
}

interface LeafletMapProps {
  places: LocationItem[];
  onRegionChange: (topLeft: { lat: number; lng: number }, bottomRight: { lat: number; lng: number }) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ places, onRegionChange }) => {
  const webViewRef = useRef<any>(null);
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const htmlContent = useMemo(() => {
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const mapBackground = '#eef2f7';
    const attributionBackground = 'rgba(255, 255, 255, 0.86)';
    const attributionColor = '#475569';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            body { margin: 0; padding: 0; background: ${mapBackground}; }
            #map { width: 100%; height: 100vh; background: ${mapBackground}; }
            .leaflet-control-attribution {
              background: ${attributionBackground} !important;
              color: ${attributionColor} !important;
              border-radius: 8px 0 0 0;
              padding: 3px 7px;
            }
            .leaflet-control-attribution a { color: #0f766e !important; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const map = L.map('map', { zoomControl: false }).setView([35.6892, 51.389], 13);
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            L.tileLayer('${tileUrl}', {
              attribution: 'OpenStreetMap'
            }).addTo(map);

            const getIcon = (type) => {
              let color = '#14b8a6';
              if (type === 'hospital') color = '#ef4444';
              if (type === 'pharmacy') color = '#22c55e';
              if (type === 'clinic') color = '#0ea5e9';

              return L.divIcon({
                className: 'custom-div-icon',
                html: '<div style="background-color:' + color + '; width: 18px; height: 18px; border-radius: 999px; border: 3px solid white; box-shadow: 0 8px 18px rgba(15,23,42,0.28);"></div>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              });
            };

            const markers = {};

            window.updateMarkers = (places) => {
              Object.keys(markers).forEach(id => {
                if (!places.find(p => p._id === id)) {
                  map.removeLayer(markers[id]);
                  delete markers[id];
                }
              });

              places.forEach(place => {
                if (!markers[place._id]) {
                  const lat = place.location?.lat || place.location?.y;
                  const lon = place.location?.lon || place.location?.x;
                  if (lat && lon) {
                    const marker = L.marker([lat, lon], { icon: getIcon(place.category) })
                      .bindPopup('<b>' + (place.name || '') + '</b><br>' + (place.address || ''))
                      .addTo(map);
                    markers[place._id] = marker;
                  }
                }
              });
            };

            map.on('moveend', () => {
              const bounds = map.getBounds();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'moveend',
                payload: {
                  topLeft: bounds.getNorthWest(),
                  bottomRight: bounds.getSouthEast()
                }
              }));
            });

            setTimeout(() => {
              const bounds = map.getBounds();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'moveend',
                payload: {
                  topLeft: bounds.getNorthWest(),
                  bottomRight: bounds.getSouthEast()
                }
              }));
            }, 700);
          </script>
        </body>
      </html>
    `;
  }, []);

  const syncMarkers = useCallback(() => {
    if (webViewRef.current && webViewAvailable) {
      webViewRef.current.injectJavaScript(`
        if (window.updateMarkers) {
          window.updateMarkers(${JSON.stringify(places)});
        }
        true;
      `);
    }
  }, [places]);

  useEffect(() => {
    syncMarkers();
  }, [syncMarkers]);

  if (!webViewAvailable || !WebViewComponent) {
    return (
      <View
        className="flex-1 rounded-2xl overflow-hidden justify-center items-center p-5 border"
        style={{ backgroundColor: isDark ? colors.card : '#ffffff', borderColor: colors.border }}
      >
        <Text
          className="text-center text-sm"
          style={{ fontFamily: 'IRANSans', color: colors.text, lineHeight: 23, ...direction.centeredText }}
        >
          {direction.isRTL
            ? 'نقشه در Expo Go در دسترس نیست.\nبرای استفاده از نقشه، development build را اجرا کنید.'
            : 'Map is not available in Expo Go.\nUse a development build to view the map.'}
        </Text>
        <Text className="text-center text-xs mt-3" style={{ color: colors.textSecondary }}>
          Map requires a development build.{'\n'}
          Run: npx expo run:android
        </Text>
      </View>
    );
  }

  const WebView = WebViewComponent;
  const mapBackground = '#eef2f7';

  return (
    <View
      className="flex-1 rounded-2xl overflow-hidden border"
      style={{ backgroundColor: mapBackground, borderColor: isDark ? colors.border : '#dbe4ee' }}
    >
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        key="leaflet-map"
        source={{ html: htmlContent }}
        onLoadEnd={syncMarkers}
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'moveend') {
              onRegionChange(data.payload.topLeft, data.payload.bottomRight);
            }
          } catch (e) {
            console.error('Error parsing map message', e);
          }
        }}
        className="flex-1"
        style={{ backgroundColor: mapBackground }}
      />
    </View>
  );
};

export default LeafletMap;

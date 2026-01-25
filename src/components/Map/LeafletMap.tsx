import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

// Dynamically import WebView to handle missing native module gracefully
let WebViewComponent: typeof import('react-native-webview').WebView | null = null;
let webViewAvailable = true;

try {
  WebViewComponent = require('react-native-webview').WebView;
} catch (e) {
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

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
          .custom-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background-color: white;
            border: 2px solid;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([35.6892, 51.389], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Custom Icons
          const getIcon = (type) => {
            let color = '#3b82f6'; // Default
            if (type === 'بیمارستان' || type === 'hospital') color = '#ef4444';
            if (type === 'داروخانه' || type === 'pharmacy') color = '#22c55e';
            if (type === 'کلینیک' || type === 'clinic') color = '#3b82f6';
            
            return L.divIcon({
              className: 'custom-div-icon',
              html: \`<div style="background-color: \${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>\`,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });
          };

          const markers = {};

          window.updateMarkers = (places) => {
            // Remove old markers
            Object.keys(markers).forEach(id => {
              if (!places.find(p => p._id === id)) {
                map.removeLayer(markers[id]);
                delete markers[id];
              }
            });

            // Add new markers
            places.forEach(place => {
              if (!markers[place._id]) {
                const lat = place.location?.lat || place.location?.y;
                const lon = place.location?.lon || place.location?.x;
                if (lat && lon) {
                  const marker = L.marker([lat, lon], { icon: getIcon(place.category) })
                    .bindPopup(\`<b>\${place.name}</b><br>\${place.address}\`)
                    .addTo(map);
                  markers[place._id] = marker;
                }
              }
            });
          };

          // Event Listeners
          map.on('moveend', () => {
            const bounds = map.getBounds();
            const message = {
              type: 'moveend',
              payload: {
                topLeft: bounds.getNorthWest(),
                bottomRight: bounds.getSouthEast()
              }
            };
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
          });
          
          // Initial bounds
          setTimeout(() => {
             const bounds = map.getBounds();
             const message = {
              type: 'moveend',
              payload: {
                topLeft: bounds.getNorthWest(),
                bottomRight: bounds.getSouthEast()
              }
            };
             window.ReactNativeWebView.postMessage(JSON.stringify(message));
          }, 1000);

        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current && webViewAvailable) {
      webViewRef.current.injectJavaScript(`
        if (window.updateMarkers) {
          window.updateMarkers(${JSON.stringify(places)});
        }
        true;
      `);
    }
  }, [places]);

  // Fallback UI when WebView is not available (Expo Go)
  if (!webViewAvailable || !WebViewComponent) {
    return (
      <View className="flex-1 rounded-xl overflow-hidden bg-gray-200 justify-center items-center p-4">
        <Text className="text-gray-600 text-center text-sm" style={{ fontFamily: 'IRANSans' }}>
          نقشه در Expo Go در دسترس نیست.{'\n'}
          برای استفاده از نقشه، از development build استفاده کنید.
        </Text>
        <Text className="text-gray-500 text-center text-xs mt-2">
          Map requires a development build.{'\n'}
          Run: npx expo run:android
        </Text>
      </View>
    );
  }

  const WebView = WebViewComponent;

  return (
    <View className="flex-1 rounded-xl overflow-hidden bg-gray-100">
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
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
      />
    </View>
  );
};

export default LeafletMap;

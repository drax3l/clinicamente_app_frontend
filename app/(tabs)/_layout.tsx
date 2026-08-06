import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  const activeColor = '#4E6E6B';
  const inactiveColor = '#97A9A6';

  const renderLabel = (title: string, focused: boolean, color: string) => (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
      <Text style={{
        color,
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
        letterSpacing: 0.1,
      }}>
        {title}
      </Text>
      <View style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: activeColor,
        marginTop: 3,
        opacity: focused ? 1 : 0
      }} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#EFF5F3',
          height: Platform.OS === 'ios' ? 90 : 75,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 10,
          shadowColor: '#2C4441',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Inicio', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9 21V12H15V21"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Buscar', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M21 21L16.65 16.65"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="citas"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Citas', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M16 2V6M8 2V6M3 10H21"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Perfil', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle
                cx="12"
                cy="8"
                r="4"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
    </Tabs>
  );
}

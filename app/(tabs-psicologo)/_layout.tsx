import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { HapticTab } from '@/components/haptic-tab';

export default function PsicologoTabLayout() {
  const activeColor = '#4E6E6B';
  const inactiveColor = '#97A9A6';

  const renderLabel = (title: string, focused: boolean, color: string) => (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
      <Text
        style={{
          color,
          fontSize: 11,
          fontWeight: focused ? '700' : '500',
          letterSpacing: 0.1,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: activeColor,
          marginTop: 3,
          opacity: focused ? 1 : 0,
        }}
      />
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
      }}
    >
      {/* 1. INICIO */}
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

      {/* 2. SOLICITUDES (con badge de 3) */}
      <Tabs.Screen
        name="solicitudes"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Solicitudes', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z"
                  stroke={color}
                  strokeWidth={focused ? 2.2 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M13.73 21A2 2 0 0 1 10.27 21"
                  stroke={color}
                  strokeWidth={focused ? 2.2 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <View
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -6,
                  backgroundColor: '#E53E3E',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>3</Text>
              </View>
            </View>
          ),
        }}
      />

      {/* 3. PACIENTES */}
      <Tabs.Screen
        name="pacientes"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Pacientes', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle
                cx="9"
                cy="7"
                r="4"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.2516 20 14.84"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M16 3.13C16.8604 3.54031 17.623 4.14104 18.1676 4.8419C18.7122 5.54276 19.0084 6.40467 19.0084 7.29167C19.0084 8.17867 18.7122 9.04058 18.1676 9.74144C17.623 10.4423 16.8604 11.043 16 11.45"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />

      {/* 4. CONFIG. */}
      <Tabs.Screen
        name="config"
        options={{
          tabBarLabel: ({ focused, color }) => renderLabel('Config.', focused, color),
          tabBarIcon: ({ color, focused }) => (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle
                cx="12"
                cy="12"
                r="3"
                stroke={color}
                strokeWidth={focused ? 2.2 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M19.4 15A1.65 1.65 0 0 0 20 12A1.65 1.65 0 0 0 19.4 9L21.5 7.4L19.5 3.9L17 5A1.65 1.65 0 0 0 14.4 3.5L14 1H10L9.6 3.5A1.65 1.65 0 0 0 7 5L4.5 3.9L2.5 7.4L4.6 9A1.65 1.65 0 0 0 4 12A1.65 1.65 0 0 0 4.6 15L2.5 16.6L4.5 20.1L7 19A1.65 1.65 0 0 0 9.6 20.5L10 23H14L14.4 20.5A1.65 1.65 0 0 0 17 19L19.5 20.1L21.5 16.6L19.4 15Z"
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

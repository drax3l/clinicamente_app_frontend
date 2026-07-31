import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

const SPECIALISTS = [
  {
    id: '1',
    name: 'Dra. Sofía Romero',
    specialty: 'Terapia Cognitivo-Conductual',
    rating: '4.9',
    reviews: '124',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Hoy',
  },
  {
    id: '2',
    name: 'Dr. Alejandro Muñoz',
    specialty: 'Neuropsicología Clínica',
    rating: '4.8',
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Mañana',
  },
  {
    id: '3',
    name: 'Dra. Laura Torres',
    specialty: 'Terapia de Pareja y Familiar',
    rating: '5.0',
    reviews: '142',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Lunes',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Header Section with Logo and Title */}
        <View style={styles.headerSection}>
          {/* Logo Card */}
          <View style={styles.logoBox}>
            <Svg width={46} height={46} viewBox="0 0 24 24" fill="none">
              {/* Outer Head Outline */}
              <Path
                d="M12 3.5C8.4 3.5 5.5 6.4 5.5 10C5.5 12.4 6.8 14.5 8.7 15.6L9.3 18C9.4 18.5 9.9 18.8 10.4 18.8H13.6C14.1 18.8 14.6 18.5 14.7 18L15.3 15.6C17.2 14.5 18.5 12.4 18.5 10C18.5 6.4 15.6 3.5 12 3.5Z"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Base/Neck detail */}
              <Path
                d="M10 20.8H14"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Internal glow / filament */}
              <Path
                d="M12 7.5V11.5M10 9.5H14"
                stroke="#FFFFFF"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* App Title */}
          <Text style={styles.title}>ClinicaMente</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Tu camino hacia el bienestar{'\n'}comienza hoy
          </Text>
        </View>

        {/* Center Illustration Section */}
        <View style={styles.illustrationContainer}>
          <Svg width={250} height={220} viewBox="0 0 250 220">
            {/* Base Shadow */}
            <Ellipse cx="125" cy="195" rx="92" ry="10" fill="#E2ECE8" />

            {/* Dashed Outer Circle */}
            <Circle
              cx="125"
              cy="108"
              r="90"
              stroke="#CFDDD8"
              strokeWidth="1.4"
              strokeDasharray="4 5"
              fill="none"
            />

            {/* Decorative Floating Dots */}
            <Circle cx="64" cy="54" r="7" fill="#B4D4CD" opacity="0.8" />
            <Circle cx="186" cy="46" r="9" fill="#D5E6E1" opacity="0.9" />
            <Circle cx="55" cy="112" r="4" fill="#C4DAD4" />
            <Circle cx="190" cy="104" r="5" fill="#B9D7CF" />

            {/* Meditating Character - Head */}
            <Circle
              cx="125"
              cy="65"
              r="21"
              stroke="#4E6E6B"
              strokeWidth="2.2"
              fill="#EFF5F3"
            />

            {/* Closed Eyes */}
            <Path
              d="M 115 64 Q 119 68 123 64"
              stroke="#4E6E6B"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M 127 64 Q 131 68 135 64"
              stroke="#4E6E6B"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Peaceful Smile */}
            <Path
              d="M 121 72 Q 125 75 129 72"
              stroke="#4E6E6B"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Character - Body */}
            <Path
              d="M 108 92 C 100 106 96 148 125 148 C 154 148 150 106 142 92 Z"
              stroke="#4E6E6B"
              strokeWidth="2.2"
              fill="#E7F2EE"
            />

            {/* Arms Resting */}
            <Path
              d="M 98 140 C 108 127 112 135 125 135 C 138 135 142 127 152 140"
              stroke="#4E6E6B"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Legs Base */}
            <Path
              d="M 90 146 C 104 152 146 152 160 146"
              stroke="#4E6E6B"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>

        {/* Specialists Section */}
        <View style={styles.specialistsSection}>
          <View style={styles.specialistsHeader}>
            <Text style={styles.specialistsTitle}>Psicólogos Destacados</Text>
            <TouchableOpacity onPress={() => router.push('/explore' as any)}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialistsScroll}
            snapToInterval={292} // card width + gap
            decelerationRate="fast"
          >
            {SPECIALISTS.map((specialist) => (
              <TouchableOpacity
                key={specialist.id}
                style={styles.specialistCard}
                activeOpacity={0.9}
                onPress={() => {
                  router.push('/explore' as any);
                }}
              >
                <Image
                  source={{ uri: specialist.image }}
                  style={styles.specialistImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.specialistInfo}>
                  <View style={styles.ratingRow}>
                    <Text style={styles.starIcon}>★</Text>
                    <Text style={styles.ratingText}>{specialist.rating}</Text>
                    <Text style={styles.reviewsText}>({specialist.reviews})</Text>
                  </View>
                  <Text style={styles.specialistName} numberOfLines={1}>
                    {specialist.name}
                  </Text>
                  <Text style={styles.specialistSub} numberOfLines={1}>
                    {specialist.specialty}
                  </Text>
                  <View style={styles.availabilityBadge}>
                    <View style={styles.activeDot} />
                    <Text style={styles.availabilityText}>
                      Disponible: {specialist.available}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Actions Section */}
        <View style={styles.actionsSection}>
          {/* Primary Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={() => {
              // Action handler
            }}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={() => {
              router.push('/explore' as any);
            }}
          >
            <Text style={styles.secondaryButtonText}>Explorar Especialistas</Text>
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>¿Eres psicólogo? </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.footerLinkText}>Únete aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
    paddingBottom: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: '#4E6E6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C2E2B',
    marginTop: 20,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#657B76',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  specialistsSection: {
    marginVertical: 18,
    width: '100%',
  },
  specialistsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialistsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4E6E6B',
  },
  specialistsScroll: {
    paddingRight: 28, // Allow scrolling past the last card nicely
    gap: 12,
  },
  specialistCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: 280,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  specialistImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#E2ECE8',
  },
  specialistInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starIcon: {
    color: '#FFB800',
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  reviewsText: {
    fontSize: 12,
    color: '#8A9F9A',
    marginLeft: 2,
  },
  specialistName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 2,
  },
  specialistSub: {
    fontSize: 12,
    color: '#657B76',
    marginBottom: 6,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  actionsSection: {
    width: '100%',
    gap: 14,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#4E6E6B',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4E6E6B',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4E6E6B',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  footerText: {
    fontSize: 15,
    color: '#657B76',
  },
  footerLinkText: {
    fontSize: 15,
    color: '#3B5B57',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const CATEGORIES = ['Todos', 'Ansiedad', 'Depresión', 'Pareja', 'Autoestima', 'Infantil'];

const SPECIALISTS = [
  {
    id: '1',
    name: 'Dra. Sofía Romero',
    specialty: 'Terapia Cognitivo-Conductual',
    rating: '4.9',
    reviews: '124',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Hoy',
    experience: '8 años de exp.',
    price: '$45',
    bio: 'Especialista en el tratamiento de ansiedad, depresión, pánico y fobias. Enfoque práctico enfocado en soluciones.',
    categories: ['Ansiedad', 'Depresión'],
  },
  {
    id: '2',
    name: 'Dr. Alejandro Muñoz',
    specialty: 'Neuropsicología Clínica',
    rating: '4.8',
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Mañana',
    experience: '12 años de exp.',
    price: '$55',
    bio: 'Especializado en evaluación neuropsicológica, trastornos cognitivos y del aprendizaje. Terapia personalizada.',
    categories: ['Autoestima'],
  },
  {
    id: '3',
    name: 'Dra. Laura Torres',
    specialty: 'Terapia de Pareja y Familiar',
    rating: '5.0',
    reviews: '142',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Lunes',
    experience: '10 años de exp.',
    price: '$50',
    bio: 'Acompañamiento a parejas y familias en resolución de conflictos, comunicación asertiva y desarrollo vincular.',
    categories: ['Pareja'],
  },
  {
    id: '4',
    name: 'Dra. Elena Ramos',
    specialty: 'Psicología Infantil y Adolescentes',
    rating: '4.9',
    reviews: '76',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Hoy',
    experience: '6 años de exp.',
    price: '$40',
    bio: 'Orientación a padres y terapia lúdica para niños y adolescentes con dificultades emocionales o de conducta.',
    categories: ['Infantil', 'Autoestima'],
  },
  {
    id: '5',
    name: 'Dr. Rodrigo Silva',
    specialty: 'Terapia Humanista y Gestalt',
    rating: '4.7',
    reviews: '85',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    available: 'Martes',
    experience: '15 años de exp.',
    price: '$60',
    bio: 'Enfoque holístico para el crecimiento personal, autoconocimiento y superación de crisis existenciales.',
    categories: ['Autoestima'],
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Filter logic
  const filteredSpecialists = SPECIALISTS.filter((spec) => {
    const matchesSearch =
      spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' || spec.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleBooking = (name: string) => {
    Alert.alert(
      'Reservar Cita',
      `¿Deseas agendar una sesión con ${name}? Esta función estará disponible en la próxima actualización.`,
      [{ text: 'Entendido', style: 'cancel' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF5F3" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 19L8 12L15 5"
              stroke="#1C2E2B"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explorar Especialistas</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <Path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="#657B76"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M21 21L16.65 16.65"
              stroke="#657B76"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, especialidad..."
            placeholderTextColor="#8A9F9A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#657B76"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredSpecialists.length > 0 ? (
          filteredSpecialists.map((specialist) => (
            <View key={specialist.id} style={styles.card}>
              {/* Doctor Info Row */}
              <View style={styles.cardHeader}>
                <Image
                  source={{ uri: specialist.image }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.doctorDetails}>
                  <View style={styles.ratingRow}>
                    <Text style={styles.starIcon}>★</Text>
                    <Text style={styles.ratingText}>{specialist.rating}</Text>
                    <Text style={styles.reviewsText}>({specialist.reviews} opiniones)</Text>
                  </View>
                  <Text style={styles.doctorName}>{specialist.name}</Text>
                  <Text style={styles.doctorSpecialty}>{specialist.specialty}</Text>
                  <Text style={styles.doctorExp}>{specialist.experience}</Text>
                </View>
              </View>

              {/* Bio Description */}
              <Text style={styles.bioText} numberOfLines={2}>
                {specialist.bio}
              </Text>

              {/* Tag Badges */}
              <View style={styles.tagsContainer}>
                {specialist.categories.map((cat) => (
                  <View key={cat} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No encontramos especialistas en esta categoría o búsqueda.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(78, 110, 107, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  headerPlaceholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1C2E2B',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginTop: 14,
    marginBottom: 6,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(78, 110, 107, 0.1)',
  },
  categoryPillSelected: {
    backgroundColor: '#4E6E6B',
    borderColor: '#4E6E6B',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4E6E6B',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#2C4441',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#E2ECE8',
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 14,
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
    fontSize: 13,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  reviewsText: {
    fontSize: 12,
    color: '#8A9F9A',
    marginLeft: 4,
  },
  doctorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C2E2B',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#657B76',
    marginBottom: 2,
  },
  doctorExp: {
    fontSize: 12,
    color: '#8A9F9A',
    fontWeight: '500',
  },
  bioText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#657B76',
    marginTop: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tagBadge: {
    backgroundColor: 'rgba(78, 110, 107, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4E6E6B',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(78, 110, 107, 0.08)',
    marginVertical: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: '#8A9F9A',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C2E2B',
  },
  pricePeriod: {
    fontSize: 12,
    color: '#657B76',
    fontWeight: '400',
  },
  actionButtons: {
    alignItems: 'flex-end',
    gap: 6,
  },
  bookButton: {
    backgroundColor: '#4E6E6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#36524F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusToday: {
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
  },
  statusLater: {
    backgroundColor: 'rgba(239, 108, 0, 0.06)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  dotToday: {
    backgroundColor: '#2E7D32',
  },
  dotLater: {
    backgroundColor: '#EF6C00',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  textToday: {
    color: '#2E7D32',
  },
  textLater: {
    color: '#EF6C00',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A9F9A',
    textAlign: 'center',
  },
});

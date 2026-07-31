import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SearchDetailScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([
        'Terapia Cognitivo Conductual',
        'Dra. Sofía Romero',
        'Ansiedad y Ataques de Pánico',
    ]);

    const popularTags = [
        'Terapia en línea',
        'Consulta presencial',
        'Disponible hoy',
        'Psicología Infantil',
        'Terapia de Pareja',
        'Estrés laboral',
    ];

    const clearRecentSearch = (index: number) => {
        setRecentSearches(recentSearches.filter((_, i) => i !== index));
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
                <Text style={styles.headerTitle}>Búsqueda Avanzada</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar Input */}
                <View style={styles.searchBox}>
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
                        style={styles.input}
                        placeholder="Especialista, síntoma o enfoque"
                        placeholderTextColor="#8A9F9A"
                        value={query}
                        onChangeText={setQuery}
                        autoFocus={true}
                    />
                    {query !== '' && (
                        <TouchableOpacity onPress={() => setQuery('')}>
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

                {/* Sección 1: Búsquedas Recientes */}
                {recentSearches.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
                            <TouchableOpacity onPress={() => setRecentSearches([])}>
                                <Text style={styles.clearAllText}>Borrar todo</Text>
                            </TouchableOpacity>
                        </View>

                        {recentSearches.map((item, index) => (
                            <View key={index} style={styles.recentItem}>
                                <TouchableOpacity
                                    style={styles.recentTextContainer}
                                    onPress={() => setQuery(item)}
                                >
                                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.clockIcon}>
                                        <Path
                                            d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                            stroke="#8A9F9A"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Svg>
                                    <Text style={styles.recentText}>{item}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => clearRecentSearch(index)} style={styles.removeIcon}>
                                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                                        <Path
                                            d="M18 6L6 18M6 6L18 18"
                                            stroke="#8A9F9A"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </Svg>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Sección 2: Lo más buscado / Búsquedas sugeridas */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Búsquedas populares</Text>
                    <View style={styles.tagsWrapper}>
                        {popularTags.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                style={styles.popularTag}
                                activeOpacity={0.7}
                                onPress={() => setQuery(tag)}
                            >
                                <Text style={styles.popularTagText}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sección 3: Filtros Rápidos / Categorías de Apoyo */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filtrar por Modalidad</Text>
                    <View style={styles.filterGrid}>
                        <TouchableOpacity style={styles.filterCard} activeOpacity={0.8}>
                            <Text style={styles.filterCardTitle}>💻 Sesión En Línea</Text>
                            <Text style={styles.filterCardSub}>Atención desde donde estés</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filterCard} activeOpacity={0.8}>
                            <Text style={styles.filterCardTitle}>🏥 Consulta Presencial</Text>
                            <Text style={styles.filterCardSub}>Especialistas cerca de ti</Text>
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
    content: {
        padding: 20,
        gap: 24,
    },
    searchBox: {
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
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1C2E2B',
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1C2E2B',
    },
    clearAllText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4E6E6B',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
    },
    recentTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    clockIcon: {
        marginRight: 10,
    },
    recentText: {
        fontSize: 13,
        color: '#657B76',
        fontWeight: '500',
    },
    removeIcon: {
        padding: 2,
    },
    tagsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    popularTag: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(78, 110, 107, 0.12)',
    },
    popularTagText: {
        fontSize: 13,
        color: '#4E6E6B',
        fontWeight: '600',
    },
    filterGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    filterCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 16,
        shadowColor: '#2C4441',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    filterCardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1C2E2B',
        marginBottom: 4,
    },
    filterCardSub: {
        fontSize: 11,
        color: '#8A9F9A',
    },
});
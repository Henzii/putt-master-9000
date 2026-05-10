import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import * as ExpoLocation from 'expo-location';
import { IconButton, RadioButton, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { GET_WEEKLIES_NEAR_ME } from '../../graphql/queries';
import { Competition, GetWeekliesNearMe } from '../../types/queries';
import useGPS from '@hooks/useGPS';
import Loading from '../../components/Loading';
import Header from '../../components/RoundedHeader/Header';
import Sheet from '../../components/Sheet';
import Spacer from '../../components/ThemedComponents/Spacer';
import { useSettings } from '@components/LocalSettingsProvider';

const RANGES_KM = [25, 50, 100, 250];

const toMeters = (km: number) => km * 1000;
const toLabel = (km: number, imperial: boolean) =>
    imperial ? `${Math.round(km / 1.60934)} mi` : `${km} km`;

const Weeklies = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const [headerSpacing, setHeaderSpacing] = useState(50);
    const [rangeKm, setRangeKm] = useState(100);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [countryCode, setCountryCode] = useState<string | null>(null);
    const geocodingDone = useRef(false);
    const gps = useGPS({updateLocation: false, useLastKnownLocation: false});
    const settings = useSettings();
    const isImperial = settings.getBoolValue('ImperialUnits');

    useEffect(() => {
        if (!gps.ready || !gps.lat || !gps.lon || geocodingDone.current) return;
        geocodingDone.current = true;
        ExpoLocation.reverseGeocodeAsync({ latitude: gps.lat, longitude: gps.lon })
            .then((result) => {
                const code = result[0]?.isoCountryCode ?? null;
                setCountryCode(code);
            })
            .catch(() => { /* fall back to server default */ });
    }, [gps.ready]);

    const { data, loading } = useQuery<GetWeekliesNearMe>(GET_WEEKLIES_NEAR_ME, {
        variables: {
            coordinates: [gps.lon, gps.lat],
            maxDistance: toMeters(rangeKm),
            countryCode,
        },
        skip: !gps.ready,
        fetchPolicy: 'cache-first',
    });

    const competitions = data?.getWeekliesNearMe ?? [];

    const renderItem = ({ item }: { item: Competition }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.course}>{item.courseName}</Text>
                <Text style={styles.time}>{item.time.slice(0, 5)}</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>
                    {t('screens.weeklies.players', { count: item.playerCount })}
                </Text>
            </View>
        </View>
    );

    const renderContent = () => {
        if (gps.error) {
            return <Text style={styles.message}>{t('screens.weeklies.gpsError')}</Text>;
        }
        if (!gps.ready || loading) {
            return <Loading loadingText={!gps.ready ? t('screens.weeklies.gpsLoading') : undefined} />;
        }
        if (!competitions.length) {
            return <Text style={styles.message}>{t('screens.weeklies.noResults')}</Text>;
        }
        return (
            <FlatList
                style={styles.list}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20, gap: 10 }}
                data={competitions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        );
    };

    return (
      <View style={styles.container}>
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <View style={styles.sheetHeader}>
            <Text variant="titleMedium">
              {t("screens.weeklies.selectRange")}
            </Text>
            <IconButton icon="close" onPress={() => setSheetOpen(false)} />
          </View>
          <Spacer size={8} />
          <RadioButton.Group
            value={String(rangeKm)}
            onValueChange={(v) => {
              setRangeKm(parseInt(v, 10));
              setSheetOpen(false);
            }}
          >
            {RANGES_KM.map((km) => (
              <RadioButton.Item
                key={km}
                label={toLabel(km, isImperial)}
                value={String(km)}
              />
            ))}
          </RadioButton.Group>
          <Spacer size={8} />
          <Text variant="labelSmall" style={styles.countryLabel}>
            {t("screens.weeklies.country")}: {countryCode ?? "..."}
          </Text>
        </Sheet>

        <Header setSpacing={setHeaderSpacing} bottomSize={20}>
          <View style={styles.headerRow}>
            <View>
              <Text variant="titleLarge" style={styles.headerTitle}>
                {t("screens.weeklies.title")}
              </Text>
              <Text style={styles.headerSubtitle}>
                {t("screens.weeklies.description", {
                  range: toLabel(rangeKm, isImperial),
                })}
              </Text>
            </View>
            <IconButton
              icon="tune"
              iconColor={colors.onPrimary}
              onPress={() => setSheetOpen(true)}
            />
          </View>
        </Header>

        <View style={[styles.content, { paddingTop: headerSpacing * 2 - 15 }]}>
          {renderContent()}
        </View>
      </View>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        backgroundColor: colors.surface,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: colors.onPrimary,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: colors.onPrimary,
        opacity: 0.85,
        fontSize: 12,
        marginTop: 4,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countryLabel: {
        color: '#888',
    },
    content: {
        flex: 1,
    },
    list: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    card: {
        backgroundColor: colors.surfaceVariant,
        borderRadius: 8,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flex: 1,
        marginRight: 8,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    course: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        color: colors.onSurfaceVariant,
        marginTop: 2,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        color: colors.onPrimary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    message: {
        textAlign: 'center',
        color: colors.onSurfaceVariant,
        padding: 20,
    },
});

export default Weeklies;

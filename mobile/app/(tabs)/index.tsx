import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';

export default function HomeScreen() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚠️ TEMPORARY: We will replace this with your Render URL in the next step
  const API_URL = 'http://172.24.183.87:3000/search-flight'; 

  async function searchFlights() {
    setLoading(true);
    setFlights([]); // Clear old results
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      alert("Still connecting... Next step: Deploy to Render!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.logo}>SKYLUXE</Text>
        <Text style={styles.tagline}>Premium Travel, Wholesale Prices</Text>
      </View>

      {/* SEARCH SECTION */}
      <View style={styles.searchBox}>
        <View style={styles.routeContainer}>
          <Text style={styles.airportCode}>LHR</Text>
          <Text style={styles.arrow}>✈</Text>
          <Text style={styles.airportCode}>JFK</Text>
        </View>
        <Text style={styles.date}>June 20, 2026</Text>
        
        <TouchableOpacity style={styles.searchButton} onPress={searchFlights} activeOpacity={0.8}>
          <Text style={styles.searchButtonText}>
            {loading ? "Searching Best Fares..." : "SEARCH FLIGHTS"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* RESULTS LIST */}
      <ScrollView contentContainerStyle={styles.resultsArea}>
        {loading && <ActivityIndicator size="large" color="#0047AB" style={{marginTop: 40}} />}
        
        {flights.map((flight, index) => (
          <View key={index} style={styles.flightCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.airlineName}>{flight.owner.name}</Text>
              <View style={styles.tag}><Text style={styles.tagText}>Direct</Text></View>
            </View>
            
            <View style={styles.cardBody}>
              <View>
                <Text style={styles.time}>10:00 AM</Text>
                <Text style={styles.city}>London</Text>
              </View>
              <Text style={styles.duration}>7h 50m</Text>
              <View>
                <Text style={styles.time}>01:50 PM</Text>
                <Text style={styles.city}>New York</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.price}>
                {flight.total_currency} {flight.total_amount}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { backgroundColor: '#0047AB', padding: 25, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logo: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  tagline: { color: '#82b1ff', fontSize: 14, marginTop: 5 },
  
  searchBox: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: -30, padding: 20, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  routeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  airportCode: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  arrow: { fontSize: 20, color: '#0047AB' },
  date: { textAlign: 'center', color: '#666', marginBottom: 20 },
  
  searchButton: { backgroundColor: '#0047AB', padding: 16, borderRadius: 12, alignItems: 'center' },
  searchButtonText: { color: 'fff', fontWeight: 'bold', fontSize: 16 },

  resultsArea: { padding: 20, paddingBottom: 50 },
  flightCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  airlineName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  tag: { backgroundColor: '#e3f2fd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#0047AB', fontSize: 12, fontWeight: 'bold' },
  
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  time: { fontSize: 18, fontWeight: '600', color: '#222' },
  city: { color: '#888', fontSize: 12 },
  duration: { color: '#ccc', fontWeight: 'bold' },
  
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 15 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#888', fontSize: 14 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#2ecc71' }
});
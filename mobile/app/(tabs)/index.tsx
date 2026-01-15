import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar, 
  Modal, 
  Alert, 
  TextInput // 🟢 Added this to allow typing
} from 'react-native';

export default function HomeScreen() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // 🟢 NEW: State to store what you type
  const [origin, setOrigin] = useState('DEL');       // Default Starting Point
  const [destination, setDestination] = useState('DXB'); // Default Destination
  const [date, setDate] = useState('2026-06-25');    // Default Date

  // 🔴 IMPORTANT: Your Render Engine URL
  const BASE_URL = 'https://my-travel-engine-xk2s.onrender.com/search-flight'; 

  // 💰 Your 10% Profit Setting
  const COMMISSION_PERCENT = 0.10; 

  async function searchFlights() {
    console.log(`Searching: ${origin} to ${destination} on ${date}`);
    setLoading(true);
    setFlights([]); 
    
    try {
      // 🟢 DYNAMIC LOGIC: We attach your typed inputs to the URL
      const dynamicUrl = `${BASE_URL}?origin=${origin}&destination=${destination}&date=${date}`;
      
      const response = await fetch(dynamicUrl);
      
      // Check if server found nothing or crashed
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setFlights(data);

    } catch (error) {
      console.error(error);
      Alert.alert("Search Failed", "Could not find flights. Ensure you used correct 3-letter codes (e.g. DEL, LHR, JFK).");
    } finally {
      setLoading(false);
    }
  }

  // Helper to calculate your profit
  const getPrice = (priceAmount) => {
    const original = parseFloat(priceAmount);
    if (isNaN(original)) return { original: "0", profit: "0", final: "0" };

    const myCommission = original * COMMISSION_PERCENT;
    const finalPrice = original + myCommission;
    
    return {
      original: original.toFixed(2),
      profit: myCommission.toFixed(2),
      final: finalPrice.toFixed(2)
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <Text style={styles.logo}>SKYLUXE</Text>
        <Text style={styles.tagline}>Global Wholesale Flights</Text>
      </View>

      {/* --- 🟢 NEW SEARCH BOX WITH INPUTS --- */}
      <View style={styles.searchBox}>
        
        {/* ROW 1: FROM & TO */}
        <View style={styles.rowInputs}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FROM (Code)</Text>
            <TextInput 
              style={styles.input} 
              value={origin} 
              onChangeText={text => setOrigin(text.toUpperCase())} 
              placeholder="DEL" 
              maxLength={3}
            />
          </View>

          <Text style={styles.arrow}>✈</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TO (Code)</Text>
            <TextInput 
              style={styles.input} 
              value={destination} 
              onChangeText={text => setDestination(text.toUpperCase())} 
              placeholder="DXB" 
              maxLength={3}
            />
          </View>
        </View>

        {/* ROW 2: DATE */}
        <Text style={styles.inputLabel}>DATE (YYYY-MM-DD)</Text>
        <TextInput 
          style={styles.input} 
          value={date} 
          onChangeText={setDate} 
          placeholder="2026-06-25" 
        />
        
        <TouchableOpacity style={styles.searchButton} onPress={searchFlights} activeOpacity={0.8}>
          <Text style={styles.searchButtonText}>
            {loading ? "SEARCHING..." : "FIND FLIGHTS"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- RESULTS LIST --- */}
      <ScrollView contentContainerStyle={styles.resultsArea}>
        {loading && <ActivityIndicator size="large" color="#0047AB" style={{marginTop: 20}} />}
        
        {flights.length === 0 && !loading && (
          <Text style={styles.emptyText}>Enter codes (e.g. DEL to DXB) and search.</Text>
        )}

        {flights.map((flight, index) => {
          const prices = getPrice(flight.total_amount);
          
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.flightCard} 
              onPress={() => setSelectedFlight(flight)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.airlineName}>{flight.owner.name}</Text>
                <Text style={styles.price}>${prices.final}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.route}>{origin} ➔ {destination}</Text>
                <Text style={styles.subText}>Tap for Profit</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* --- POPUP MODAL (DETAILS) --- */}
      <Modal visible={!!selectedFlight} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalTitle}>Flight Breakdown</Text>
            
            {selectedFlight && (
              <View>
                <Text style={styles.airlineLarge}>{selectedFlight.owner.name}</Text>
                
                {/* YOUR PROFIT SECTION */}
                <View style={styles.profitBox}>
                  <Text style={styles.boxTitle}>BUSINESS CALCULATOR</Text>
                  
                  <View style={styles.row}>
                    <Text style={styles.label}>Airline Cost:</Text>
                    <Text style={styles.value}>${getPrice(selectedFlight.total_amount).original}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Your Commission (10%):</Text>
                    <Text style={styles.profitValue}>+${getPrice(selectedFlight.total_amount).profit}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.row}>
                    <Text style={styles.totalLabel}>Customer Pays:</Text>
                    <Text style={styles.totalValue}>${getPrice(selectedFlight.total_amount).final}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setSelectedFlight(null)}
                >
                  <Text style={styles.closeButtonText}>Close Window</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  header: { backgroundColor: '#0047AB', padding: 25, paddingTop: 50, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  logo: { fontSize: 28, fontWeight: '900', color: '#fff' },
  tagline: { color: '#bdc3c7', fontSize: 14, marginTop: 5 },
  
  // NEW INPUT STYLES
  searchBox: { backgroundColor: '#fff', margin: 20, marginTop: -25, padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  inputGroup: { width: '40%' },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  input: { backgroundColor: '#f0f2f5', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  arrow: { fontSize: 20, color: '#0047AB', marginTop: 15 },
  
  searchButton: { backgroundColor: '#0047AB', padding: 15, borderRadius: 10, alignItems: 'center' },
  searchButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  resultsArea: { padding: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  flightCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  airlineName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#27ae60' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between' },
  route: { color: '#7f8c8d', fontSize: 14 },
  subText: { color: '#0047AB', fontSize: 12, fontWeight: '600' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 20, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  airlineLarge: { fontSize: 18, textAlign: 'center', color: '#0047AB', marginBottom: 20, fontWeight: 'bold' },
  
  profitBox: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 20, borderWidth: 1, borderColor: '#e1e4e8' },
  boxTitle: { fontSize: 12, fontWeight: 'bold', color: '#95a5a6', marginBottom: 10, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#34495e' },
  value: { fontWeight: 'bold' },
  profitValue: { color: '#27ae60', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 8 },
  totalLabel: { fontWeight: 'bold', fontSize: 16 },
  totalValue: { fontWeight: 'bold', fontSize: 18, color: '#27ae60' },

  closeButton: { backgroundColor: '#ecf0f1', padding: 15, borderRadius: 10, alignItems: 'center' },
  closeButtonText: { color: '#7f8c8d', fontWeight: 'bold' }
});
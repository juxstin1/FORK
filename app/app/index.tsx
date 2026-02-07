
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// --- Nothing Aesthetic Theme ---
const COLORS = {
  BG: '#000000',
  FG: '#FFFFFF',
  ACCENT: '#D71920', // Nothing Red
  DIM: '#333333',
};

// --- Glyph Components ---

const DotMatrixChar = ({ char, active = true }: { char: string; active?: boolean }) => (
  <Text style={[styles.glyph, { color: active ? COLORS.FG : COLORS.DIM }]}>
    {char}
  </Text>
);

const GlyphFace = ({ state }: { state: 'idle' | 'sleeping' | 'eating' | 'dead' }) => {
  if (state === 'dead') {
    return (
      <View style={styles.faceContainer}>
        <DotMatrixChar char="X" />
        <DotMatrixChar char="_" />
        <DotMatrixChar char="X" />
      </View>
    );
  }
  if (state === 'sleeping') {
    return (
      <View style={styles.faceContainer}>
        <DotMatrixChar char="-" />
        <DotMatrixChar char="." />
        <DotMatrixChar char="-" />
      </View>
    );
  }
  if (state === 'eating') {
    return (
      <View style={styles.faceContainer}>
        <DotMatrixChar char="O" />
        <DotMatrixChar char="w" />
        <DotMatrixChar char="O" />
      </View>
    );
  }
  // Idle
  return (
    <View style={styles.faceContainer}>
      <DotMatrixChar char="•" />
      <DotMatrixChar char="—" />
      <DotMatrixChar char="•" />
    </View>
  );
};

export default function GlyphPet() {
  const [hunger, setHunger] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [petState, setPetState] = useState<'idle' | 'sleeping' | 'eating' | 'dead'>('idle');

  // --- Game Loop ---
  useEffect(() => {
    if (petState === 'dead') return;

    const interval = setInterval(() => {
      setHunger((h) => Math.max(0, h - 2));
      setEnergy((e) => (petState === 'sleeping' ? Math.min(100, e + 5) : Math.max(0, e - 1)));
    }, 1000);

    return () => clearInterval(interval);
  }, [petState]);

  // --- State Management ---
  useEffect(() => {
    if (hunger <= 0 || energy <= 0) {
      setPetState('dead');
    }
  }, [hunger, energy]);

  const feed = () => {
    if (petState === 'dead' || petState === 'sleeping') return;
    setPetState('eating');
    setHunger((h) => Math.min(100, h + 20));
    setTimeout(() => setPetState('idle'), 2000);
  };

  const sleep = () => {
    if (petState === 'dead') return;
    if (petState === 'sleeping') {
      setPetState('idle');
    } else {
      setPetState('sleeping');
    }
  };

  const revive = () => {
    setHunger(100);
    setEnergy(100);
    setPetState('idle');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>GLYPH (1)</Text>
        <View style={styles.dot} />
      </View>

      {/* Main Display */}
      <View style={styles.mainDisplay}>
        <GlyphFace state={petState} />
        <Text style={styles.statusText}>{petState.toUpperCase()}</Text>
      </View>

      {/* Stats (Dotted Lines) */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>HUNGER</Text>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${hunger}%` }]} />
          </View>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>ENERGY</Text>
          <View style={[styles.barContainer]}>
             <View style={[styles.barFill, { width: `${energy}%`, backgroundColor: COLORS.FG }]} />
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {petState === 'dead' ? (
           <TouchableOpacity style={[styles.button, styles.primaryBtn]} onPress={revive}>
             <Text style={styles.btnText}>RESET SYSTEM</Text>
           </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={feed}>
              <Text style={styles.btnText}>FEED :: 01</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, petState === 'sleeping' && styles.activeBtn]} 
              onPress={sleep}
            >
              <Text style={styles.btnText}>{petState === 'sleeping' ? 'WAKE :: 00' : 'SLEEP :: 02'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
    fontFamily: 'monospace', // Fallback
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIM,
  },
  headerText: {
    color: COLORS.FG,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.ACCENT,
  },
  mainDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
  },
  glyph: {
    color: COLORS.FG,
    fontSize: 64,
    fontWeight: '900',
  },
  statusText: {
    color: COLORS.ACCENT,
    fontSize: 12,
    letterSpacing: 4,
  },
  statsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 60,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  statLabel: {
    color: COLORS.DIM,
    fontSize: 10,
    width: 60,
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.DIM,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.ACCENT,
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: COLORS.DIM,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  primaryBtn: {
    borderColor: COLORS.ACCENT,
    backgroundColor: 'rgba(215, 25, 32, 0.1)',
    width: '100%',
    alignItems: 'center',
  },
  activeBtn: {
    backgroundColor: COLORS.DIM,
    borderColor: COLORS.FG,
  },
  btnText: {
    color: COLORS.FG,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
});

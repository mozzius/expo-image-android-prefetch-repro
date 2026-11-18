import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

type Policy = 'memory' | 'memory-disk';

type Run = {
  uri: string;
  policy: Policy;
  prefetched: boolean;
  cacheType: string | null;
};

// A 3000x2000 JPEG. Each run gets a fresh query string, so nothing from an earlier run is cached.
function freshUri() {
  return `https://picsum.photos/id/1015/3000/2000.jpg?run=${Date.now()}`;
}

export default function App() {
  const [run, setRun] = useState<Run | null>(null);

  async function prefetchThenRender(policy: Policy) {
    setRun(null);
    const uri = freshUri();
    const prefetched = await Image.prefetch(uri, policy);
    setRun({ uri, policy, prefetched, cacheType: null });
  }

  return (
    <View style={styles.container}>
      <Button title="Prefetch with 'memory', then render" onPress={() => prefetchThenRender('memory')} />
      <Button
        title="Prefetch with 'memory-disk', then render"
        onPress={() => prefetchThenRender('memory-disk')}
      />
      {run && (
        <>
          <Text>cachePolicy: {run.policy}</Text>
          <Text>Image.prefetch resolved: {String(run.prefetched)}</Text>
          <Text testID="cacheType">onLoad cacheType: {run.cacheType ?? 'loading'}</Text>
          <Text>expected: memory</Text>
          <Image
            key={run.uri}
            source={{ uri: run.uri }}
            cachePolicy={run.policy}
            contentFit="contain"
            onLoad={(e) => setRun((r) => (r ? { ...r, cacheType: e.cacheType } : r))}
            style={styles.image}
          />
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  image: {
    width: 300,
    height: 200,
  },
});

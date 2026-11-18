# expo-image Android prefetch repro

On Android, `Image.prefetch(url, 'memory')` doesn't warm any cache that a later `<Image cachePolicy="memory">` for the same URL can read. The `<Image>` reports `cacheType: 'none'`. With `'memory-disk'` it reports `'disk'`, never `'memory'`. On iOS both report `'memory'`.

## Run

```sh
npm install
npx expo start
```

Open the app in Expo Go (SDK 58) on Android, then tap each button:

- **Prefetch with 'memory', then render**: `Image.prefetch(uri, 'memory')`, then `<Image cachePolicy="memory">`.
- **Prefetch with 'memory-disk', then render**: the same with `'memory-disk'`.

Each tap uses a fresh image URL. The screen shows the `cacheType` from the `<Image>`'s `onLoad`.

| Platform | Prefetch policy | `onLoad` cacheType |
| --- | --- | --- |
| Android | `memory` | `none` |
| Android | `memory-disk` | `disk` |
| iOS | `memory` | `memory` |
| iOS | `memory-disk` | `memory` |

To see what Glide does, turn on its logs before tapping:

```sh
adb shell setprop log.tag.Engine VERBOSE
adb shell setprop log.tag.DecodeJob VERBOSE
adb shell setprop log.tag.Downsampler VERBOSE
adb logcat -s Engine DecodeJob Downsampler
```

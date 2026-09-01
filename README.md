# eStudio Lightbox (v0.30)

A dedicated, precision digital tracing and light table application designed to help artists, calligraphers, illustrators, and learners draw and trace references effortlessly.

---

## 🎨 Features
- **1:1 Calibrated Physical Screen Ruler:** Dual-axis X and Y metric (mm/cm) and imperial scale rulers calibrated directly to your screen.
- **Edge Stenciler:** Instant photo edge detection that converts photos into clean outline line-art with adjustable density.
- **Multi-Layer Canvas:** Load multiple reference images simultaneously with independent movement, scaling, rotation, and luminous layer chips.
- **Hardware Controls:** 10%–200% luminance boost with direct number input, warm ambient light tint, high-contrast boost, and color inversion.
- **Perspective Keystone Correction:** Correct angled reference photos on horizontal and vertical axes.
- **Live Camera Feed:** Trace physical 3D objects, sketches, or leaves placed behind the tablet.
- **Touch Lock (Trace Mode):** Complete screen freeze with a 1-second safety hold unlock so you can lay paper directly on the glass.
- **Offline My Collection:** Bookmarks layouts and saves drawings locally in device storage with zero paywalls.

---

## 🚀 Running & Developing Locally

```bash
# Serve files directly via any local server (e.g. VS Code Live Server or http-server)
npx http-server files -p 5500 -o
```

---

## 📱 Building Standalone Android APK (.apk / .aab)

This repository includes a pre-configured **Capacitor Android** project.

### 1. Sync Web Assets to Android
Whenever you modify files in `/files`, sync them to the native Android build:
```bash
npm run sync
```

### 2. Open in Android Studio
To inspect, customize, test on an emulator, or build a signed release APK:
```bash
npm run open
```
In Android Studio:
- Select **Build $\rightarrow$ Build Bundle(s) / APK(s) $\rightarrow$ Build APK(s)**
- Or click the green **Play (Run)** button to install and launch directly on your connected tablet or phone.

### 3. Direct Command-Line APK Build
If Android SDK & JDK 17+ are configured in your environment:
```bash
npm run build:apk
```
*Generated Debug APK will be located at:*
`android/app/build/outputs/apk/debug/app-debug.apk`

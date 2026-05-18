---
name: project-architecture
description: Guía comprensiva de la arquitectura Frontend y general del proyecto Apptelier (Layout, Header, Footer, Modales y proveedores de estado).
---

# 🏗️ Apptelier Frontend Architecture Skill

Este documento describe la arquitectura fundacional de **Frontend** estándar para aplicaciones usando Next.js (App Router) conectadas al ecosistema de Payload CMS. Garantiza que cualquier desarrollo mantenga la estructura de componentes, la jerarquía de providers y el comportamiento funcional esperado.

---

## 1. 🧩 The Root Layout (`src/app/(frontend)/layout.tsx`)

El *Root Layout* es la columna vertebral de la aplicación. Extrae los datos globales desde Payload CMS (Globals) y encapsula la aplicación en una jerarquía estandarizada de *Providers*.

### Estrategia de Data Fetching (Server-Side)
- **Payload Globals Fetching**: El Layout debe solicitar asíncronamente los *Globals* (`SiteSettings`, `Header`) usando la Local API de Payload (`await getPayload()`). NUNCA se hacen llamados HTTP (fetch) al propio servidor.
  - Esto inyecta textos enriquecidos (Lexical Rich Text) para páginas legales, diccionarios o settings estructurados de la app.

### Jerarquía de Providers
El `<body>` debe estar envuelto en el siguiente orden general de Providers para inyectar correctamente el estado global de la app:
1. `ThemeProvider` (Manejo de variables CSS para los temas Light/Dark)
2. `AuthSessionProvider` (Contexto de usuario activo)
3. `Zustand Global Stores` / `AppProvider` (Eventos generales)
4. Modales flotantes (`ToastProvider`, etc.)

### Estructura base del Layout
Por dentro, la distribución del código debe seguir estrictamente este esqueleto:
```tsx
<Providers>
  <HeaderWrapper>
     {/* Inyección del menú administrable desde Payload */}
     <Header data={globals.header} />
  </HeaderWrapper>

  <main className="min-h-screen">
    {children}
  </main>

  <Footer 
    contactData={globals.settings.contact}
    privacyData={globals.settings.privacyPolicy}
    termsData={globals.settings.terms}
  />

  {/* Modales Flotantes Universales */}
  <GlobalSearchModal />
</Providers>
```

---

## 2. 🔝 The Header (`src/layout/Header/index.tsx`)

El Header suele ser un `"use client"` component. Independientemente de qué visuales estéticas imponga el diseño de Apptelier, debe respetar esta funcionalidad:

### Navegación
- **Mobile-First Overlay**: Si el menú de móvil es a pantalla completa (`isMenuOpen`), debe renderizarse con `createPortal(..., document.body)` para sobreponerse a cualquier `z-index` conflictivo en la jerarquía del DOM.
- **Scroll Behavior (Glassmorphism)**: Se debe forrar al header con un event listener de scroll para habilitar difuminados de fondo en cuanto el usuario empiece a bajar por la pantalla.

### Acciones
Los botones a la derecha del Header siempre disparan contextos u overlays globales en lugar de enrutar la web:
- **Buscar**: Invoza un `<GlobalSearchModal>` flotante.
- **Usuario/Auth**: Si no hay sesión, abre el Modal de Login. Si la hay, expide un Dropdown / Sheet.

---

## 3. 🦶 The Footer (`src/layout/Footer/index.tsx`)

El Footer centraliza links legales y contactos, pero bajo una estricta experiencia "Single-Page" que bloquea la pérdida de retención del usuario:

### Documentos Legales como Modales (Lexical Modal Pattern)
En lugar de forzar re-rendereos enviando al usuario a `/terms` o `/privacy`, la información corre en **modales**:
- El footer recibe objetos `SerializedEditorState` (provenientes de Payload) desde el Layout principal.
- Cuando el usuario hace clic en "Política de Privacidad", una variable de estado local (`activeModal = 'privacy'`) activa un Dialog Box / Modal a pantalla completa mostrando `<RichText data={privacyData} />`.
- Esto mantiene al usuario exactamente donde estaba comprando o navegando sin romper flujos.

---

## 4. 🖼️ Iconos y Sistema de Assets

- **Iconos Funcionales**: Usa estandarizadamente `react-icons` (ej: `FaUser`, `FiSearch`) para toda iconografía de interfaz base (flechas, checkmarks, menús).
- **SVGs Dinámicos (Logos)**: Cualquier logotipo oficial (la firma de Apptelier, etc.) o gráfico vectorial de identidad DEBEN aislarse como un React Component (`src/assets/Logo.tsx`). 
  - Ese componente DEBE aceptar las props genéricas `className` y de preferencia `fill="currentColor"` para que asimile los colores CSS vía clases Tailwind (e.g. `text-brand-primary` u ocultamientos Light/Dark).

---

## 5. 💅 Topología de Tema y Styling Dinámico

Cuando debas crear una nueva vista en Apptelier:
- **Estructura (*TailwindCSS*)**: Usa utilidades estructurales puras (`flex`, `grid`, `absolute`, `p-6`, `gap-4`).
- **Pintura y Tema (*CSS Variables*)**: Usa obligatoriamente las Custom Properties (ej. `var(--theme-bg)`, `var(--theme-text)`) como se define en el skill de `payload-theming.md`. No quemes colores hexagesimales duros en el frontend (`bg-white`, `text-black`), hazlo todo interoperable semánticamente. 
- **Fluidez**: Todos los componentes principales deben tener `transition-all duration-200` y efectos discretos en hover para que Apptelier se sienta moderno, responsivo e inmediato.

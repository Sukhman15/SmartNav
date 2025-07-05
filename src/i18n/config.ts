import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: "Hello! I'm your AI shopping assistant with advanced ML capabilities.",
      help: "How can I help you today?",
      findProduct: "Find products",
      checkPrice: "Check prices",
      getRecipes: "Get recipes",
      nutritionInfo: "Nutrition info",
      addToList: "Add to list",
      compare: "Compare products",
      scanProduct: "Scan product",
      voiceInput: "Voice input",
      typeMessage: "Type your message...",
      processing: "Processing with AI...",
      loadingModels: "Loading AI models...",
      error: "I apologize, but I encountered an error. Please try again.",
      noProductFound: "I couldn't recognize this product. Could you describe what you're looking for?",
      confidence: "Confidence",
      sentiment: "Sentiment",
      language: "Language",
      responseTime: "Response Time",
      mlInsights: "ML Insights",
      mlEnhanced: "ML Enhanced",
      aiAssistant: "AI Shopping Assistant",
      suggestions: {
        greeting: ["Find products", "Check prices", "Get recipes", "Nutrition info"],
        findProduct: ["Search by category", "Browse popular items", "Check availability"],
        checkPrice: ["Show deals", "Compare alternatives", "Budget options"],
        nutritionInfo: ["Healthy alternatives", "Dietary options", "Nutrition comparison"],
        recipe: ["Quick meals", "Healthy recipes", "Budget-friendly options"],
        general: ["Product search", "Price comparison", "Store navigation", "Help"]
      }
    }
  },
  hi: {
    translation: {
      welcome: "नमस्ते! मैं आपकी AI शॉपिंग सहायक हूं जो उन्नत ML क्षमताओं के साथ है।",
      help: "मैं आपकी कैसे मदद कर सकती हूं?",
      findProduct: "उत्पाद खोजें",
      checkPrice: "कीमतें देखें",
      getRecipes: "रेसिपी प्राप्त करें",
      nutritionInfo: "पोषण जानकारी",
      addToList: "सूची में जोड़ें",
      compare: "उत्पादों की तुलना करें",
      scanProduct: "उत्पाद स्कैन करें",
      voiceInput: "आवाज़ इनपुट",
      typeMessage: "अपना संदेश टाइप करें...",
      processing: "AI के साथ प्रोसेसिंग...",
      loadingModels: "AI मॉडल लोड हो रहे हैं...",
      error: "मैं क्षमा चाहती हूं, लेकिन मुझे एक त्रुटि का सामना करना पड़ा। कृपया फिर से कोशिश करें।",
      noProductFound: "मैं इस उत्पाद को पहचान नहीं सकी। क्या आप बता सकते हैं कि आप क्या ढूंढ रहे हैं?",
      confidence: "विश्वास",
      sentiment: "भावना",
      language: "भाषा",
      responseTime: "प्रतिक्रिया समय",
      mlInsights: "ML अंतर्दृष्टि",
      mlEnhanced: "ML उन्नत",
      aiAssistant: "AI शॉपिंग सहायक",
      suggestions: {
        greeting: ["उत्पाद खोजें", "कीमतें देखें", "रेसिपी प्राप्त करें", "पोषण जानकारी"],
        findProduct: ["श्रेणी के अनुसार खोजें", "लोकप्रिय आइटम देखें", "उपलब्धता जांचें"],
        checkPrice: ["छूट दिखाएं", "विकल्पों की तुलना करें", "बजट विकल्प"],
        nutritionInfo: ["स्वस्थ विकल्प", "आहार विकल्प", "पोषण तुलना"],
        recipe: ["त्वरित भोजन", "स्वस्थ रेसिपी", "बजट-अनुकूल विकल्प"],
        general: ["उत्पाद खोज", "कीमत तुलना", "स्टोर नेविगेशन", "मदद"]
      }
    }
  },
  fr: {
    translation: {
      welcome: "Bonjour! Je suis votre assistant d'achat IA avec des capacités ML avancées.",
      help: "Comment puis-je vous aider?",
      findProduct: "Trouver des produits",
      checkPrice: "Vérifier les prix",
      getRecipes: "Obtenir des recettes",
      nutritionInfo: "Info nutrition",
      addToList: "Ajouter à la liste",
      compare: "Comparer les produits",
      scanProduct: "Scanner le produit",
      voiceInput: "Entrée vocale",
      typeMessage: "Tapez votre message...",
      processing: "Traitement avec l'IA...",
      loadingModels: "Chargement des modèles IA...",
      error: "Je m'excuse, mais j'ai rencontré une erreur. Veuillez réessayer.",
      noProductFound: "Je n'ai pas pu reconnaître ce produit. Pouvez-vous décrire ce que vous cherchez?",
      confidence: "Confiance",
      sentiment: "Sentiment",
      language: "Langue",
      responseTime: "Temps de réponse",
      mlInsights: "Aperçus ML",
      mlEnhanced: "ML Amélioré",
      aiAssistant: "Assistant d'achat IA",
      suggestions: {
        greeting: ["Trouver des produits", "Vérifier les prix", "Obtenir des recettes", "Info nutrition"],
        findProduct: ["Rechercher par catégorie", "Parcourir les articles populaires", "Vérifier la disponibilité"],
        checkPrice: ["Afficher les offres", "Comparer les alternatives", "Options budgétaires"],
        nutritionInfo: ["Alternatives saines", "Options diététiques", "Comparaison nutritionnelle"],
        recipe: ["Repas rapides", "Recettes saines", "Options économiques"],
        general: ["Recherche de produits", "Comparaison de prix", "Navigation en magasin", "Aide"]
      }
    }
  },
  es: {
    translation: {
      welcome: "¡Hola! Soy tu asistente de compras IA con capacidades ML avanzadas.",
      help: "¿Cómo puedo ayudarte?",
      findProduct: "Encontrar productos",
      checkPrice: "Verificar precios",
      getRecipes: "Obtener recetas",
      nutritionInfo: "Información nutricional",
      addToList: "Agregar a la lista",
      compare: "Comparar productos",
      scanProduct: "Escanear producto",
      voiceInput: "Entrada de voz",
      typeMessage: "Escribe tu mensaje...",
      processing: "Procesando con IA...",
      loadingModels: "Cargando modelos IA...",
      error: "Lo siento, pero encontré un error. Por favor, inténtalo de nuevo.",
      noProductFound: "No pude reconocer este producto. ¿Puedes describir lo que buscas?",
      confidence: "Confianza",
      sentiment: "Sentimiento",
      language: "Idioma",
      responseTime: "Tiempo de respuesta",
      mlInsights: "Perspectivas ML",
      mlEnhanced: "ML Mejorado",
      aiAssistant: "Asistente de compras IA",
      suggestions: {
        greeting: ["Encontrar productos", "Verificar precios", "Obtener recetas", "Información nutricional"],
        findProduct: ["Buscar por categoría", "Explorar artículos populares", "Verificar disponibilidad"],
        checkPrice: ["Mostrar ofertas", "Comparar alternativas", "Opciones de presupuesto"],
        nutritionInfo: ["Alternativas saludables", "Opciones dietéticas", "Comparación nutricional"],
        recipe: ["Comidas rápidas", "Recetas saludables", "Opciones económicas"],
        general: ["Búsqueda de productos", "Comparación de precios", "Navegación en tienda", "Ayuda"]
      }
    }
  },
  de: {
    translation: {
      welcome: "Hallo! Ich bin Ihr KI-Einkaufsassistent mit erweiterten ML-Fähigkeiten.",
      help: "Wie kann ich Ihnen helfen?",
      findProduct: "Produkte finden",
      checkPrice: "Preise prüfen",
      getRecipes: "Rezepte erhalten",
      nutritionInfo: "Nährwertinformationen",
      addToList: "Zur Liste hinzufügen",
      compare: "Produkte vergleichen",
      scanProduct: "Produkt scannen",
      voiceInput: "Spracheingabe",
      typeMessage: "Geben Sie Ihre Nachricht ein...",
      processing: "Verarbeitung mit KI...",
      loadingModels: "KI-Modelle werden geladen...",
      error: "Entschuldigung, aber ich bin auf einen Fehler gestoßen. Bitte versuchen Sie es erneut.",
      noProductFound: "Ich konnte dieses Produkt nicht erkennen. Können Sie beschreiben, wonach Sie suchen?",
      confidence: "Vertrauen",
      sentiment: "Stimmung",
      language: "Sprache",
      responseTime: "Antwortzeit",
      mlInsights: "ML-Einblicke",
      mlEnhanced: "ML-Verbessert",
      aiAssistant: "KI-Einkaufsassistent",
      suggestions: {
        greeting: ["Produkte finden", "Preise prüfen", "Rezepte erhalten", "Nährwertinformationen"],
        findProduct: ["Nach Kategorie suchen", "Beliebte Artikel durchsuchen", "Verfügbarkeit prüfen"],
        checkPrice: ["Angebote anzeigen", "Alternativen vergleichen", "Budgetoptionen"],
        nutritionInfo: ["Gesunde Alternativen", "Diätoptionen", "Nährwertvergleich"],
        recipe: ["Schnelle Mahlzeiten", "Gesunde Rezepte", "Budgetfreundliche Optionen"],
        general: ["Produktsuche", "Preisvergleich", "Geschäftsnavigation", "Hilfe"]
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n; 
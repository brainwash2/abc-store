'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductPurchaseSection from './ProductPurchaseSection';
import ProductSpecifications from './ProductSpecifications';
import ProductDescription from './ProductDescription';
import CustomerReviews from './CustomerReviews';
import RelatedProducts from './RelatedProducts';

interface ProductDetailsInteractiveProps {

  // No props needed as we'll use mock data
}
const ProductDetailsInteractive = ({}: ProductDetailsInteractiveProps) => {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'ar'>('fr');
  const [cartItemCount, setCartItemCount] = useState(3);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as 'fr' | 'ar';
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const handleLanguageChange = (language: 'fr' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  // Mock product data
  const productImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1494498902093-87f291949d17",
    alt: "Modern silver laptop computer open displaying desktop screen on white background"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1605000907146-7a109667002e",
    alt: "Close-up view of laptop keyboard with backlit keys in dark environment"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1697375320366-4145d826e233",
    alt: "Side profile view of thin laptop computer showing ports and connectivity options"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1695891888323-661dbe27dc79",
    alt: "Laptop computer screen displaying colorful software interface and applications"
  }];


  const productInfo = {
    name: "Laptop HP Pavilion 15-eh3000nk",
    price: 185000,
    originalPrice: 220000,
    currency: "DZD",
    availability: 'in-stock' as const,
    rating: 4.5,
    reviewCount: 127,
    brand: "HP",
    model: "Pavilion 15-eh3000nk",
    sku: "HP-PAV-15-2024"
  };

  const productVariants = [
  {
    id: "config-1",
    name: "8GB RAM + 256GB SSD",
    price: 185000,
    available: true
  },
  {
    id: "config-2",
    name: "16GB RAM + 512GB SSD",
    price: 235000,
    available: true
  },
  {
    id: "config-3",
    name: "16GB RAM + 1TB SSD",
    price: 285000,
    available: false
  }];


  const specifications = [
  {
    id: "performance",
    name: {
      fr: "Performance",
      ar: "الأداء"
    },
    specs: [
    {
      label: { fr: "Processeur", ar: "المعالج" },
      value: "AMD Ryzen 5 7530U (6 cœurs, 12 threads)"
    },
    {
      label: { fr: "Mémoire RAM", ar: "ذاكرة الوصول العشوائي" },
      value: "16 GB DDR4-3200"
    },
    {
      label: { fr: "Stockage", ar: "التخزين" },
      value: "512 GB SSD NVMe PCIe"
    },
    {
      label: { fr: "Carte graphique", ar: "كرت الرسومات" },
      value: "AMD Radeon Graphics intégrée"
    }]

  },
  {
    id: "display",
    name: {
      fr: "Écran",
      ar: "الشاشة"
    },
    specs: [
    {
      label: { fr: "Taille", ar: "الحجم" },
      value: "15.6 pouces"
    },
    {
      label: { fr: "Résolution", ar: "الدقة" },
      value: "1920 x 1080 (Full HD)"
    },
    {
      label: { fr: "Type de dalle", ar: "نوع الشاشة" },
      value: "IPS, anti-reflets"
    },
    {
      label: { fr: "Luminosité", ar: "السطوع" },
      value: "250 nits"
    }]

  },
  {
    id: "connectivity",
    name: {
      fr: "Connectivité",
      ar: "الاتصال"
    },
    specs: [
    {
      label: { fr: "Wi-Fi", ar: "الواي فاي" },
      value: "Wi-Fi 6 (802.11ax)"
    },
    {
      label: { fr: "Bluetooth", ar: "البلوتوث" },
      value: "Bluetooth 5.2"
    },
    {
      label: { fr: "Ports USB", ar: "منافذ USB" },
      value: "2x USB-A 3.2, 1x USB-C"
    },
    {
      label: { fr: "Autres ports", ar: "منافذ أخرى" },
      value: "HDMI 1.4, Jack audio 3.5mm"
    }]

  },
  {
    id: "physical",
    name: {
      fr: "Dimensions",
      ar: "الأبعاد"
    },
    specs: [
    {
      label: { fr: "Dimensions", ar: "الأبعاد" },
      value: "358 x 242 x 19.9 mm"
    },
    {
      label: { fr: "Poids", ar: "الوزن" },
      value: "1.75 kg"
    },
    {
      label: { fr: "Batterie", ar: "البطارية" },
      value: "41 Wh, jusqu'à 8 heures"
    },
    {
      label: { fr: "Système", ar: "نظام التشغيل" },
      value: "Windows 11 Famille"
    }]

  }];


  const productDescription = {
    fr: `Le HP Pavilion 15-eh3000nk est un ordinateur portable polyvalent conçu pour répondre aux besoins quotidiens des utilisateurs modernes. Équipé d'un processeur AMD Ryzen 5 7530U de dernière génération, il offre des performances exceptionnelles pour le multitâche, la navigation web, et les applications bureautiques.\n\nSon écran Full HD de 15.6 pouces avec technologie IPS garantit des couleurs vives et des angles de vision larges, parfait pour le travail comme pour le divertissement. La conception élégante et la construction robuste en font un compagnon idéal pour les professionnels et les étudiants.\n\nAvec sa connectivité Wi-Fi 6 et ses multiples ports, ce laptop s'adapte parfaitement à l'environnement de travail moderne. La batterie longue durée assure une autonomie suffisante pour une journée de travail complète.`,
    ar: `يعد HP Pavilion 15-eh3000nk حاسوباً محمولاً متعدد الاستخدامات مصمماً لتلبية الاحتياجات اليومية للمستخدمين العصريين. مزود بمعالج AMD Ryzen 5 7530U من الجيل الأحدث، يوفر أداءً استثنائياً لتعدد المهام وتصفح الويب وتطبيقات المكتب.\n\nتضمن شاشته Full HD مقاس 15.6 بوصة بتقنية IPS ألواناً زاهية وزوايا رؤية واسعة، مثالية للعمل والترفيه على حد سواء. التصميم الأنيق والبناء المتين يجعله رفيقاً مثالياً للمهنيين والطلاب.\n\nمع اتصال Wi-Fi 6 ومنافذ متعددة، يتكيف هذا الحاسوب المحمول بشكل مثالي مع بيئة العمل الحديثة. البطارية طويلة المدى تضمن استقلالية كافية ليوم عمل كامل.`
  };

  const productFeatures = {
    fr: [
    "Processeur AMD Ryzen 5 7530U haute performance avec 6 cœurs et 12 threads",
    "16 GB de RAM DDR4 pour un multitâche fluide et efficace",
    "SSD NVMe de 512 GB pour des temps de démarrage ultra-rapides",
    "Écran Full HD IPS de 15.6\" avec couleurs précises et angles de vision larges",
    "Connectivité Wi-Fi 6 pour une connexion internet ultra-rapide",
    "Design fin et léger avec seulement 1.75 kg pour une portabilité optimale",
    "Batterie longue durée jusqu\'à 8 heures d\'autonomie",
    "Windows 11 préinstallé avec toutes les dernières fonctionnalités",
    "Ports USB-C et USB-A pour une connectivité polyvalente",
    "Garantie constructeur HP de 2 ans incluse"],

    ar: [
    "معالج AMD Ryzen 5 7530U عالي الأداء مع 6 أنوية و 12 خيط معالجة",
    "16 جيجابايت من ذاكرة الوصول العشوائي DDR4 لتعدد مهام سلس وفعال",
    "قرص SSD NVMe بسعة 512 جيجابايت لأوقات إقلاع فائقة السرعة",
    "شاشة Full HD IPS مقاس 15.6 بوصة بألوان دقيقة وزوايا رؤية واسعة",
    "اتصال Wi-Fi 6 لاتصال إنترنت فائق السرعة",
    "تصميم نحيف وخفيف بوزن 1.75 كيلوغرام فقط لقابلية نقل مثلى",
    "بطارية طويلة المدى تصل إلى 8 ساعات من الاستقلالية",
    "نظام Windows 11 مثبت مسبقاً مع جميع الميزات الأحدث",
    "منافذ USB-C و USB-A لاتصال متعدد الاستخدامات",
    "ضمان الشركة المصنعة HP لمدة عامين مشمول"]

  };

  const customerReviews = [
  {
    id: 1,
    userName: "Ahmed Benali",
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_152e3046e-1762273638431.png",
    userAvatarAlt: "Professional headshot of middle-aged man with short dark hair wearing blue shirt",
    rating: 5,
    date: "2024-11-10",
    title: "Excellent rapport qualité-prix",
    comment: "Très satisfait de cet achat. Le laptop est rapide, l'écran est de bonne qualité et la batterie tient bien la journée. Parfait pour le travail et les études. Livraison rapide et emballage soigné.",
    helpful: 12,
    verified: true
  },
  {
    id: 2,
    userName: "Fatima Zohra",
    userAvatar: "https://images.unsplash.com/photo-1729014578250-9d0251eebdf0",
    userAvatarAlt: "Professional portrait of young woman with long dark hair wearing white blouse",
    rating: 4,
    date: "2024-11-08",
    title: "Bon produit mais quelques points à améliorer",
    comment: "Dans l'ensemble, je suis contente de mon achat. Les performances sont au rendez-vous et le design est élégant. Seul bémol : les ventilateurs peuvent être un peu bruyants lors de tâches intensives.",
    helpful: 8,
    verified: true
  },
  {
    id: 3,
    userName: "Karim Messaoudi",
    userAvatar: "https://images.unsplash.com/photo-1646324799589-4eaa88a9a82a",
    userAvatarAlt: "Casual portrait of young man with beard wearing gray sweater outdoors",
    rating: 5,
    date: "2024-11-05",
    title: "Parfait pour les étudiants",
    comment: "Je recommande vivement ce laptop pour les étudiants. Il gère parfaitement tous mes logiciels de programmation et de design. La qualité de construction est solide et le prix est très compétitif.",
    helpful: 15,
    verified: true
  }];


  const relatedProducts = [
  {
    id: 2,
    name: "Laptop ASUS VivoBook 15 X515",
    price: 165000,
    originalPrice: 185000,
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf",
    imageAlt: "Silver ASUS laptop computer open on white desk with modern design",
    rating: 4.2,
    reviewCount: 89,
    availability: 'in-stock' as const
  },
  {
    id: 3,
    name: "Laptop Lenovo IdeaPad 3 15ITL6",
    price: 175000,
    image: "https://images.unsplash.com/photo-1672299529602-bca497631e28",
    imageAlt: "Black Lenovo laptop computer displaying colorful desktop wallpaper",
    rating: 4.0,
    reviewCount: 156,
    availability: 'limited' as const
  },
  {
    id: 4,
    name: "Laptop Dell Inspiron 15 3000",
    price: 155000,
    originalPrice: 170000,
    image: "https://images.unsplash.com/photo-1518472803163-8d3a9e90792c",
    imageAlt: "White Dell laptop computer with sleek design on modern workspace",
    rating: 3.8,
    reviewCount: 203,
    availability: 'in-stock' as const
  },
  {
    id: 5,
    name: "Laptop Acer Aspire 5 A515",
    price: 145000,
    image: "https://images.unsplash.com/photo-1586057330627-d20ebde58b2f",
    imageAlt: "Gray Acer laptop computer showing productivity software interface",
    rating: 4.1,
    reviewCount: 134,
    availability: 'out-of-stock' as const
  },
  {
    id: 6,
    name: "Laptop MSI Modern 15 A5M",
    price: 195000,
    image: "https://images.unsplash.com/photo-1623367890059-e88d01d09bb4",
    imageAlt: "Premium MSI laptop with backlit keyboard in dark environment",
    rating: 4.6,
    reviewCount: 67,
    availability: 'in-stock' as const
  }];


  const handleAddToCart = (quantity: number, variantId: string) => {
    setCartItemCount((prev) => prev + quantity);
    // Show success message or navigate to cart
  };

  const handleBuyNow = (quantity: number, variantId: string) => {
    // Navigate to checkout with selected product
    router.push('/checkout');
  };

  const handleAddToWishlist = () => {
    setIsInWishlist(!isInWishlist);
  };

  const handleSubmitReview = (review: {rating: number;title: string;comment: string;}) => {
    // Handle review submission
    console.log('New review:', review);
  };

  const handleRelatedProductAddToCart = (productId: number) => {
    setCartItemCount((prev) => prev + 1);
  };

  const handleCartClick = () => {
    router.push('/shopping-cart');
  };

  const handleAccountClick = () => {

    // Handle account menu
  };
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted"></div>
          <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        isAuthenticated={true}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onCartClick={handleCartClick}
        onAccountClick={handleAccountClick} />


      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-text-secondary">
              <li>
                <a href="/homepage" className="hover:text-primary transition-smooth">
                  {currentLanguage === 'fr' ? 'Accueil' : 'الرئيسية'}
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/product-catalog" className="hover:text-primary transition-smooth">
                  {currentLanguage === 'fr' ? 'Produits' : 'المنتجات'}
                </a>
              </li>
              <li>/</li>
              <li className="text-text-primary font-medium">
                {currentLanguage === 'fr' ? 'Ordinateurs portables' : 'أجهزة الكمبيوتر المحمولة'}
              </li>
            </ol>
          </nav>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Images and Info */}
            <div className="lg:col-span-2 space-y-8">
              <ProductImageGallery
                images={productImages}
                productName={productInfo.name} />

              
              <ProductInfo
                product={productInfo}
                currentLanguage={currentLanguage} />

            </div>

            {/* Right Column - Purchase Section */}
            <div className="lg:col-span-1">
              <ProductPurchaseSection
                variants={productVariants}
                currentLanguage={currentLanguage}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onAddToWishlist={handleAddToWishlist}
                isInWishlist={isInWishlist} />

            </div>
          </div>

          {/* Product Details Sections */}
          <div className="space-y-8">
            <ProductSpecifications
              specifications={specifications}
              currentLanguage={currentLanguage} />


            <ProductDescription
              description={productDescription}
              features={productFeatures}
              currentLanguage={currentLanguage} />


            <CustomerReviews
              reviews={customerReviews}
              averageRating={4.5}
              totalReviews={127}
              ratingDistribution={{ 5: 78, 4: 32, 3: 12, 2: 3, 1: 2 }}
              currentLanguage={currentLanguage}
              onSubmitReview={handleSubmitReview} />


            <RelatedProducts
              products={relatedProducts}
              currentLanguage={currentLanguage}
              onAddToCart={handleRelatedProductAddToCart} />

          </div>
        </div>
      </main>
    </div>);

};

export default ProductDetailsInteractive;
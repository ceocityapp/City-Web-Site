"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { BoostDialog } from "@/components/shared/BoostDialog";
import {
  Star, MapPin, Clock, Phone, Mail, ShoppingCart, Check, ArrowLeft, MessageSquare, AlertTriangle, ChevronRight, Zap,
} from "lucide-react";
import Link from "next/link";
import { HUESCA_SHOPS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";
import { cn } from "@/lib/utils";

function generateShopProducts(shop: typeof HUESCA_SHOPS[0]) {
  const sid = shop.id;
  const cat = shop.category;
  type Product = { id: number; shop_id: number; name: string; price: number; description: string; image_url: string; created_at: string };
  const p = (id: number, name: string, price: number, desc: string, img: string): Product => ({ id, shop_id: sid, name, price, description: desc, image_url: img, created_at: "" });

  if (cat === "Restaurantes") return [
    p(1, "Croquetas de Rabo de Toro", 12.50, "Receta tradicional con carne deshilachada y bechamel cremosa.", "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80"),
    p(2, "Ternasco de Aragón", 18.90, "Cordero asado al horno con patatas a lo pobre.", "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80"),
    p(3, "Ensalada de la Huerta", 9.50, "Verduras frescas de temporada con vinagreta de miel.", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"),
    p(4, "Postre del Día", 6.00, "Dulce artesanal del chef, consultar disponibilidad.", "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"),
  ];
  if (cat === "Cafetería") return [
    p(1, "Chocolate con Churros", 4.50, "Chocolate espeso tradicional con churros recién hechos.", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"),
    p(2, "Café Especial", 2.80, "Café de origen selecto tostado artesanalmente.", "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"),
    p(3, "Tarta de Queso Casera", 4.50, "Receta tradicional con queso cremoso de la región.", "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80"),
    p(4, "Croissant de Mantequilla", 2.50, "Horneado fresco cada mañana con mantequilla francesa.", "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80"),
  ];
  if (cat === "Librería") return [
    p(1, "Novedades del Mes", 19.90, "Selección curada de las últimas novedades literarias.", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80"),
    p(2, "Clásicos Aragoneses", 14.50, "Colección de obras de autores de la tierra.", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"),
    p(3, "Libro Infantil Ilustrado", 12.00, "Cuentos ilustrados para los más pequeños.", "https://images.unsplash.com/photo-1629992101753-56d196c8adf7?w=400&q=80"),
    p(4, "Pack Regalo Lector", 29.90, "Libro + marcapáginas artesanal + bolsa de tela.", "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&q=80"),
  ];
  if (cat === "Deportes") return [
    p(1, "Bono 10 Sesiones Escalada", 65.00, "Acceso a todas las zonas de boulder durante 10 sesiones.", "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=80"),
    p(2, "Pies de Gato Alquiler", 5.00, "Alquiler de pies de gato por sesión. Todas las tallas.", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80"),
    p(3, "Magnesio Bloque", 3.50, "Bloque de magnesio de alta adherencia.", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80"),
    p(4, "Camiseta Boulder Huesca", 22.00, "Camiseta técnica con el logo del centro.", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"),
  ];
  if (cat === "Panadería") return [
    p(1, "Pan de Hogaza Artesano", 3.80, "Pan rústico de masa madre, horneado en horno de leña.", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"),
    p(2, "Empanada de Carne", 2.50, "Empanada tradicional con carne de ternera y cebolla.", "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400&q=80"),
    p(3, "Pastas de Almendra", 6.90, "Caja de pastas artesanas con almendra del Somontano.", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"),
    p(4, "Barra de Chapata", 1.80, "Chapata crujiente ideal para bocadillos.", "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80"),
  ];
  if (cat === "Salud") return [
    p(1, "Gafas de Sol Premium", 89.00, "Monturas de marcas seleccionadas con protección UV.", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80"),
    p(2, "Lentillas Mensuales", 32.00, "Pack mensual de lentillas de contacto.", "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?w=400&q=80"),
    p(3, "Líquido Lentillas 360ml", 12.50, "Solución multiusos para lentillas blandas.", "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80"),
    p(4, "Cordón para Gafas", 8.00, "Cordón textil elegante para sujetar las gafas.", "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80"),
  ];
  if (cat === "Alimentación") return [
    p(1, "Jamón DOP Teruel", 89.00, "Jamón curado con Denominación de Origen Teruel.", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80"),
    p(2, "Queso de Radiquero", 14.50, "Queso artesano de oveja del Somontano.", "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80"),
    p(3, "Aceite Oliva Virgen Extra", 12.00, "Aceite del Somontano, primera prensada en frío.", "https://images.unsplash.com/photo-1474979266404-7eaacdc948b6?w=400&q=80"),
    p(4, "Lote Gourmet Huesca", 45.00, "Selección de embutidos, queso y vino de la tierra.", "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400&q=80"),
  ];
  // Fallback generic products
  return [
    p(1, "Producto Estrella", 15.00, "Nuestro producto más vendido y recomendado.", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80"),
    p(2, "Oferta Especial", 10.00, "Oferta por tiempo limitado.", "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80"),
    p(3, "Pack Ahorro", 25.00, "Pack especial con los favoritos de la tienda.", "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&q=80"),
    p(4, "Tarjeta Regalo", 20.00, "Tarjeta regalo canjeable por cualquier producto.", "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80"),
  ];
}

function generateShopServices(shop: typeof HUESCA_SHOPS[0]) {
  const sid = shop.id;
  const cat = shop.category;
  type Service = { id: number; shop_id: number; name: string; price: number; price_type: string; duration: string | null; description: string; image_url: string | null; created_at: string };
  const s = (id: number, name: string, price: number, pt: string, dur: string | null, desc: string): Service => ({ id, shop_id: sid, name, price, price_type: pt, duration: dur, description: desc, image_url: null, created_at: "" });

  if (cat === "Restaurantes") return [
    s(1, "Catering para Eventos", 25, "from", "3-5h", "Servicio completo de catering con cocina aragonesa."),
    s(2, "Menú Degustación Privado", 55, "fixed", "2h", "Experiencia gastronómica exclusiva para grupos reducidos."),
  ];
  if (cat === "Cafetería") return [
    s(1, "Catering Desayunos", 12, "from", "1-2h", "Servicio de desayuno para reuniones y eventos."),
    s(2, "Reserva Espacio Privado", 0, "free", null, "Reserva nuestra sala para reuniones o celebraciones."),
  ];
  if (cat === "Librería") return [
    s(1, "Club de Lectura Mensual", 0, "free", "2h", "Encuentro mensual para compartir y debatir lecturas."),
    s(2, "Encargo de Libros", 0, "free", null, "Encargamos cualquier libro en 24-48h."),
  ];
  if (cat === "Deportes") return [
    s(1, "Clase Iniciación Escalada", 20, "fixed", "1.5h", "Clase grupal para principiantes con material incluido."),
    s(2, "Entrenamiento Personal", 35, "fixed", "1h", "Sesión personalizada con monitor titulado."),
  ];
  if (cat === "Panadería") return [
    s(1, "Encargo de Pan Especial", 0, "free", null, "Encargos de panes especiales con 24h de antelación."),
    s(2, "Taller de Pan Artesano", 25, "fixed", "3h", "Aprende a hacer tu propio pan de masa madre."),
  ];
  if (cat === "Salud") return [
    s(1, "Revisión Visual Gratuita", 0, "free", "30min", "Revisión completa de la vista sin compromiso."),
    s(2, "Adaptación de Lentillas", 30, "fixed", "45min", "Estudio personalizado para adaptación de lentes de contacto."),
  ];
  if (cat === "Alimentación") return [
    s(1, "Degustación de Productos", 0, "free", "30min", "Degustación gratuita de jamón y quesos artesanos."),
    s(2, "Cesta Regalo Personalizada", 10, "from", null, "Montamos cestas regalo a medida con productos de la tierra."),
  ];
  return [
    s(1, "Consulta Personalizada", 0, "free", "30min", "Te asesoramos según tus necesidades."),
    s(2, "Servicio a Domicilio", 5, "from", null, "Entrega a domicilio en Huesca ciudad."),
  ];
}

const DEMO_REVIEWS = [
  { id: 1, rating: 5, text: "El mejor café de Huesca sin duda. Las pastas están increíbles.", user_name: "María García", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, rating: 4, text: "Muy buen ambiente y servicio rápido. Volveré seguro.", user_name: "Pablo Torres", created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 3, rating: 5, text: "Excelente relación calidad-precio. El croissant es de los mejores que he probado.", user_name: "Elena Ruiz", created_at: new Date(Date.now() - 604800000).toISOString() },
];

const ratingLabels: Record<number, string> = { 5: "Excelente", 4: "Muy bien", 3: "Bien", 2: "Regular", 1: "Malo" };

export default function ShopDetailPage() {
  const { shopId } = useParams();
  const { addItem } = useCart();
  const shop = HUESCA_SHOPS.find(s => s.id === Number(shopId)) || HUESCA_SHOPS[0];
  const products = generateShopProducts(shop);
  const services = generateShopServices(shop);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(DEMO_REVIEWS);

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  if (!HUESCA_SHOPS.find(s => s.id === Number(shopId)) && shopId !== undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Tienda no encontrada</h1>
        <p className="text-muted-foreground mb-6">No se ha encontrado una tienda con ese identificador.</p>
        <Link href="/marketplace"><Button className="rounded-full bg-primary font-bold">Volver al Marketplace</Button></Link>
      </div>
    );
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(
      { ...product, created_at: "" },
      { ...shop, is_draft: false, created_at: "" }
    );
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    setReviews([{ id: Date.now(), rating: reviewRating, text: reviewText, user_name: "Tú", created_at: new Date().toISOString() }, ...reviews]);
    setReviewText(""); setReviewRating(5); setShowReviewForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80">
        <img src={shop.image_url} alt={shop.name} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link href="/marketplace" className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="absolute top-4 right-4">
          <BoostDialog targetType="page" trigger={
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/90 backdrop-blur text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all btn-press boost-glow">
              <Zap className="w-3.5 h-3.5" /> Impulsar
            </button>
          } />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              {shop.is_featured && <Badge className="bg-primary text-white border-0 mb-2">Destacado</Badge>}
              <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
              <p className="text-white/70 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4" />{shop.address}</p>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card/90 backdrop-blur shadow-lg">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-black">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviews.length})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
          <Link href="/marketplace" className="hover:text-foreground">Mercado</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-bold truncate">{shop.name}</span>
        </nav>

        {/* Info Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground"><Clock className="w-3 h-3" />{shop.opening_hours}</div>
          {shop.phone && <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground"><Phone className="w-3 h-3" />{shop.phone}</div>}
          {shop.email && <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-sm font-semibold text-muted-foreground"><Mail className="w-3 h-3" />{shop.email}</div>}
        </div>

        <p className="text-muted-foreground mb-6">{shop.description}</p>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="w-full justify-start bg-card border border-border rounded-xl h-11 p-1 mb-6">
            <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white">
              Productos ({products.length})
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white">
              Servicios ({services.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-foreground data-[state=active]:text-white">
              Opiniones ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className={cn("bg-card rounded-2xl border border-border/60 overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 transition-all group btn-press", addedId === product.id && "ring-2 ring-primary/20")}>
                  {product.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img src={product.image_url} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={imageFallback} />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <span className="text-lg font-bold text-primary">{product.price.toFixed(2)}€</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                    <Button
                      size="sm"
                      className={`w-full rounded-full gap-2 font-bold transition-all ${addedId === product.id ? "bg-green-500 hover:bg-green-500" : "bg-primary"}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedId === product.id ? <><Check className="w-4 h-4" /> Añadido</> : <><ShoppingCart className="w-4 h-4" /> Añadir a la cesta</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="bg-card rounded-2xl border border-border/60 p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      {service.duration && <p className="text-xs text-muted-foreground mt-1">Duración: {service.duration}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-bold text-primary">
                        {service.price_type === "free" ? "Gratis" : service.price_type === "from" ? `Desde ${service.price}€` : `${service.price}€`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {!showReviewForm ? (
                <Button onClick={() => setShowReviewForm(true)} variant="outline" className="w-full rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5">
                  <MessageSquare className="w-4 h-4" /> Escribir opinión
                </Button>
              ) : (
                <div className="bg-card rounded-2xl border border-primary/20 p-5 space-y-4">
                  <p className="font-semibold">Tu puntuación</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setReviewRating(s)} className="p-1 btn-press transition-transform">
                        <Star className={cn("w-8 h-8 transition-all", s <= reviewRating ? "fill-amber-400 text-amber-400 scale-110" : "text-muted-foreground/30 hover:text-amber-300")} />
                      </button>
                    ))}
                    <span className="text-sm text-muted-foreground ml-2 self-center">{ratingLabels[reviewRating]}</span>
                  </div>
                  <Textarea placeholder="Cuéntanos tu experiencia..." className="rounded-xl resize-none" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowReviewForm(false)}>Cancelar</Button>
                    <Button onClick={handleSubmitReview} className="bg-primary rounded-full font-bold">Publicar</Button>
                  </div>
                </div>
              )}

              {reviews.map((review) => (
                <div key={review.id} className="bg-card rounded-2xl border border-border/60 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{review.user_name.charAt(0)}</AvatarFallback></Avatar>
                    <div>
                      <p className="text-sm font-medium">{review.user_name}</p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/20"}`} />)}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(review.created_at).toLocaleDateString("es-ES")}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{review.text}</p>
                </div>
              ))}

              {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">Sin opiniones todavía. ¡Sé el primero en opinar!</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

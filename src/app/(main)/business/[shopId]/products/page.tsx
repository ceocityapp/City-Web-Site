"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Plus, Search, Package, Edit, Trash2, Eye, EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { HUESCA_SHOPS } from "@/lib/huesca-data";
import { imageFallback } from "@/lib/image-fallback";

const DEMO_PRODUCTS = [
  { id: 1, name: "Croquetas de rabo de toro", price: 12.50, description: "6 unidades. Nuestra especialidad.", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80", active: true, stock: 25 },
  { id: 2, name: "Ternasco al horno", price: 18.90, description: "Con patatas panaderas y pimientos.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", active: true, stock: 10 },
  { id: 3, name: "Ensalada César Tatau", price: 9.50, description: "Con pollo a la brasa, parmesano y nuestra salsa especial.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", active: true, stock: 30 },
  { id: 4, name: "Tabla de quesos aragoneses", price: 14.00, description: "Selección de quesos locales con mermelada.", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80", active: false, stock: 0 },
  { id: 5, name: "Tarta de chocolate", price: 7.50, description: "Casera, con base de galleta y chocolate negro.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", active: true, stock: 8 },
];

export default function BusinessProductsPage() {
  const { shopId } = useParams();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", description: "", price: "", stock: "", image: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", stock: "", image: "" });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const shop = HUESCA_SHOPS.find((s) => s.id === Number(shopId));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleAddProduct = () => {
    if (!addForm.name.trim()) return;
    const newProduct = {
      id: Date.now(),
      name: addForm.name,
      description: addForm.description,
      price: parseFloat(addForm.price) || 0,
      stock: parseInt(addForm.stock) || 0,
      image: addForm.image || "",
      active: true,
    };
    setProducts((prev) => [newProduct, ...prev]);
    setAddForm({ name: "", description: "", price: "", stock: "", image: "" });
    setShowAddDialog(false);
  };

  const startEdit = (product: typeof DEMO_PRODUCTS[0]) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
    });
  };

  const handleSaveEdit = () => {
    if (editingId === null) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? { ...p, name: editForm.name, description: editForm.description, price: parseFloat(editForm.price) || 0, stock: parseInt(editForm.stock) || 0, image: editForm.image }
          : p
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
        <h1 className="text-2xl font-black mb-2">Negocio no encontrado</h1>
        <Link href="/business"><Button className="rounded-full bg-primary font-bold mt-4">Mis negocios</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link href={`/business/${shopId}/dashboard`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard de {shop.name}
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Productos</h1>
          <p className="text-sm text-muted-foreground">{products.length} productos · {products.filter((p) => p.active).length} activos</p>
        </div>
        <Button className="rounded-full bg-primary font-bold" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> Añadir producto
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Buscar productos..." className="pl-9 rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((product) => (
          <div key={product.id} className={`bg-card rounded-2xl border border-border overflow-hidden transition-all ${!product.active ? "opacity-60" : "hover:shadow-md"}`}>
            {editingId === product.id ? (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-bold mb-1 block">Nombre</label>
                    <Input className="rounded-xl h-9 text-sm" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold mb-1 block">Descripcion</label>
                    <Input className="rounded-xl h-9 text-sm" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Precio</label>
                    <Input type="number" className="rounded-xl h-9 text-sm" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Stock</label>
                    <Input type="number" className="rounded-xl h-9 text-sm" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" className="rounded-full text-sm h-8" onClick={() => setEditingId(null)}>Cancelar</Button>
                  <Button className="rounded-full bg-primary text-sm h-8 font-bold" onClick={handleSaveEdit}>Guardar</Button>
                </div>
              </div>
            ) : deletingId === product.id ? (
              <div className="p-4 flex items-center justify-between">
                <p className="text-sm font-semibold">Eliminar {product.name}?</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-full text-sm h-8" onClick={() => setDeletingId(null)}>Cancelar</Button>
                  <Button className="rounded-full bg-red-500 hover:bg-red-600 text-white text-sm h-8 font-bold" onClick={() => handleDelete(product.id)}>Eliminar</Button>
                </div>
              </div>
            ) : (
            <div className="flex items-center gap-4 p-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                {product.image ? (
                  <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={imageFallback} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-black text-sm">{product.name}</h3>
                  {!product.active && <Badge variant="secondary" className="text-[10px]">Oculto</Badge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm font-black text-primary">{product.price.toFixed(2)}€</span>
                  <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleActive(product.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title={product.active ? "Ocultar" : "Mostrar"}
                >
                  {product.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(product)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeletingId(product.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-semibold">No se encontraron productos</p>
          <p className="text-sm mt-1">Prueba con otra búsqueda o añade un nuevo producto</p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-black mb-4">Nuevo producto</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-bold mb-1 block">Nombre</label>
                <Input className="rounded-xl h-10" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="Nombre del producto" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Descripcion</label>
                <Input className="rounded-xl h-10" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} placeholder="Descripcion breve" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold mb-1 block">Precio</label>
                  <Input type="number" className="rounded-xl h-10" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block">Stock</label>
                  <Input type="number" className="rounded-xl h-10" value={addForm.stock} onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">URL de imagen</label>
                <Input className="rounded-xl h-10" value={addForm.image} onChange={(e) => setAddForm({ ...addForm, image: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="outline" className="rounded-full font-bold" onClick={() => { setShowAddDialog(false); setAddForm({ name: "", description: "", price: "", stock: "", image: "" }); }}>Cancelar</Button>
              <Button className="rounded-full bg-primary font-bold" onClick={handleAddProduct}>Crear producto</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

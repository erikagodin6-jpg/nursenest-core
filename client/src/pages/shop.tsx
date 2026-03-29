import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LocaleLink } from "@/lib/LocaleLink";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  ShoppingBag, Star, Tag, Download, Package, BookOpen, Shield,
  ArrowRight, Plus, Edit, Trash2, X, Sparkles, Crown, Filter, Palette,
  Upload, Loader2, FileText, Image,
} from "lucide-react";
import type { DigitalProduct } from "@shared/schema";
import { adminFetch } from "@/lib/admin-fetch";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getEffectivePrice(product: DigitalProduct) {
  const now = new Date();
  const saleActive = product.salePrice && product.saleStartsAt && product.saleEndsAt
    && now >= new Date(product.saleStartsAt) && now <= new Date(product.saleEndsAt);
  return saleActive ? product.salePrice! : product.price;
}

function ProductCard({ product }: { product: DigitalProduct }) {
  const { t } = useI18n();
  const effectivePrice = getEffectivePrice(product);
  const now = new Date();
  const saleActive = product.salePrice && product.saleStartsAt && product.saleEndsAt
    && now >= new Date(product.saleStartsAt) && now <= new Date(product.saleEndsAt);
  const hasDiscount = saleActive
    ? true
    : (product.compareAtPrice && product.compareAtPrice > product.price);
  const savingsPercent = saleActive
    ? Math.round((1 - effectivePrice / product.price) * 100)
    : (product.compareAtPrice && product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : 0);
  return (
    <LocaleLink href={`/shop/${product.slug}`}>
      <Card className="group hover:shadow-lg hover:border-primary/30 transition-all h-full cursor-pointer" data-testid={`card-product-${product.slug}`}>
        {product.coverImageUrl ? (
          <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gray-100 relative">
            <img
              src={product.coverImageUrl}
              alt={`${product.title} - NurseNest study resource`}
              title={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
              decoding="async"
              data-testid={`img-product-${product.slug}`}
            />
            {hasDiscount && savingsPercent > 0 && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" data-testid={`badge-discount-${product.slug}`}>
                -{savingsPercent}%
              </span>
            )}
          </div>
        ) : (
          <div className="aspect-[16/10] overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
            <div className="text-center">
              <Package className="w-8 h-8 text-primary/40 mx-auto mb-1" />
              <span className="text-xs text-primary/50 font-medium">{product.category}</span>
            </div>
            {hasDiscount && savingsPercent > 0 && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" data-testid={`badge-discount-${product.slug}`}>
                -{savingsPercent}%
              </span>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${product.slug}`}>
              {product.category}
            </Badge>
            {product.featured && (
              <Badge className="bg-amber-100 text-amber-700 text-xs" data-testid={`badge-featured-${product.slug}`}>
                <Star className="w-3 h-3 mr-1" /> {t("shop.product.popular")}
              </Badge>
            )}
            {product.tierTarget && product.tierTarget !== "all" && (
              <Badge variant="outline" className="text-xs">{product.tierTarget.toUpperCase()}</Badge>
            )}
            {(product as any).previewUrl && (
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">{t("shop.product.preview")}</Badge>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors" data-testid={`text-product-title-${product.slug}`}>
            {product.title}
          </h3>
          {product.shortDescription && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-2" data-testid={`text-product-desc-${product.slug}`}>
              {product.shortDescription}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary" data-testid={`text-price-${product.slug}`}>
              {formatPrice(effectivePrice)}
            </span>
            {saleActive && (
              <>
                <span className="text-sm text-gray-400 line-through" data-testid={`text-compare-price-${product.slug}`}>
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-medium text-green-600" data-testid={`text-savings-${product.slug}`}>
                  {t("shop.product.save")} {formatPrice(product.price - effectivePrice)}
                </span>
              </>
            )}
            {!saleActive && product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-sm text-gray-400 line-through" data-testid={`text-compare-price-${product.slug}`}>
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="text-xs font-medium text-green-600" data-testid={`text-savings-${product.slug}`}>
                  {t("shop.product.save")} {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Download className="w-3 h-3" />
            <span>{t("shop.product.instantPdf")}</span>
            {product.questionCount && product.questionCount > 0 && (
              <>
                <span className="mx-1">|</span>
                <BookOpen className="w-3 h-3" />
                <span>{product.questionCount} {t("shop.product.questions")}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </LocaleLink>
  );
}

function useFileUpload(toast: ReturnType<typeof useToast>["toast"]) {
  const [uploading, setUploading] = useState<"file" | "cover" | null>(null);

  const uploadFile = async (file: File, type: "file" | "cover"): Promise<string | null> => {
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const creds = localStorage.getItem("nursenest-credentials");
      if (creds) {
        const { username, password } = JSON.parse(creds);
        formData.append("username", username);
        formData.append("password", password);
      } else {
        const userRaw = localStorage.getItem("nursenest-user");
        if (userRaw) {
          const parsed = JSON.parse(userRaw);
          if (parsed?.tier === "admin" && parsed?.id) formData.append("adminId", parsed.id);
        }
      }

      const res = await fetch("/api/admin/shop/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      toast({ title: "File uploaded", description: data.fileName });
      return data.url;
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
      return null;
    } finally {
      setUploading(null);
    }
  };

  return { uploading, uploadFile };
}

function AdminProductManager() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [syncUrl, setSyncUrl] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saleProductId, setSaleProductId] = useState<string | null>(null);
  const [saleForm, setSaleForm] = useState({ salePriceDollars: "", saleStartsAt: "", saleEndsAt: "" });
  const [form, setForm] = useState({
    title: "", slug: "", description: "", shortDescription: "", priceDollars: "19.99",
    compareAtDollars: "", fileUrl: "", coverImageUrl: "", category: "Cram Guide",
    tierTarget: "all", examTarget: "", featured: false,
  });
  const { uploading, uploadFile } = useFileUpload(toast);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, type);
    if (url) {
      if (type === "file") setForm(f => ({ ...f, fileUrl: url }));
      else setForm(f => ({ ...f, coverImageUrl: url }));
    }
    e.target.value = "";
  };

  const loadProducts = async () => {
    try {
      const res = await adminFetch(`/api/admin/shop/products`);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleExport = async () => {
    try {
      const res = await adminFetch("/api/admin/shop/products/export");
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nursenest-products-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Products exported", description: `${data.count} products saved to file` });
    } catch (e: any) {
      toast({ title: "Export failed", description: e.message, variant: "destructive" });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const products = data.products || data;
      if (!Array.isArray(products)) throw new Error("Invalid format");
      const res = await adminFetch("/api/admin/shop/products/import", {
        method: "POST",
        body: { products },
      });
      if (!res.ok) throw new Error("Import failed");
      const result = await res.json();
      const created = result.results.filter((r: any) => r.action === "created").length;
      const updated = result.results.filter((r: any) => r.action === "updated").length;
      const failed = result.results.filter((r: any) => r.action === "failed").length;
      toast({ title: "Import complete", description: `${created} created, ${updated} updated, ${failed} failed` });
      loadProducts();
    } catch (e: any) {
      toast({ title: "Import failed", description: e.message, variant: "destructive" });
    }
    e.target.value = "";
  };

  const handlePushToProduction = async () => {
    if (!syncUrl.trim()) {
      toast({ title: "Enter your production URL", description: "e.g. https://www.nursenest.ca", variant: "destructive" });
      return;
    }
    setSyncing(true);
    try {
      const exportRes = await adminFetch("/api/admin/shop/products/export");
      if (!exportRes.ok) throw new Error("Failed to export products");
      const exportData = await exportRes.json();

      const creds = localStorage.getItem("nursenest-credentials");
      let authBody: any = { products: exportData.products };
      if (creds) {
        const { username, password } = JSON.parse(creds);
        authBody.username = username;
        authBody.password = password;
      } else {
        const userRaw = localStorage.getItem("nursenest-user");
        if (userRaw) {
          const parsed = JSON.parse(userRaw);
          if (parsed?.tier === "admin" && parsed?.id) authBody.adminId = parsed.id;
        }
      }

      const baseUrl = syncUrl.trim().replace(/\/+$/, "");
      const importRes = await fetch(`${baseUrl}/api/admin/shop/products/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authBody),
      });
      if (!importRes.ok) {
        const err = await importRes.json().catch(() => ({ error: "Import request failed" }));
        throw new Error(err.error || `HTTP ${importRes.status}`);
      }
      const result = await importRes.json();
      const created = result.results.filter((r: any) => r.action === "created").length;
      const updated = result.results.filter((r: any) => r.action === "updated").length;
      const failed = result.results.filter((r: any) => r.action === "failed").length;
      toast({ title: "Synced to production", description: `${created} created, ${updated} updated, ${failed} failed` });
      setShowSync(false);
    } catch (e: any) {
      toast({ title: "Sync failed", description: e.message, variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/admin/shop/products/${editingId}` : "/api/admin/shop/products";
      const method = editingId ? "PUT" : "POST";
      const res = await adminFetch(url, {
        method,
        body: {
          ...form,
          price: Math.round(parseFloat(form.priceDollars) * 100) || 0,
          compareAtPrice: form.compareAtDollars ? Math.round(parseFloat(form.compareAtDollars) * 100) : null,
          priceDollars: undefined,
          compareAtDollars: undefined,
        },
      });
      if (res.ok) {
        toast({ title: editingId ? "Product updated" : "Product created" });
        setShowForm(false);
        setEditingId(null);
        setForm({ title: "", slug: "", description: "", shortDescription: "", priceDollars: "19.99", compareAtDollars: "", fileUrl: "", coverImageUrl: "", category: "Cram Guide", tierTarget: "all", examTarget: "", featured: false });
        loadProducts();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await adminFetch(`/api/admin/shop/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Product deleted" });
      loadProducts();
    }
  };

  const handleSaveSale = async (productId: string) => {
    try {
      const res = await adminFetch(`/api/admin/shop/products/${productId}/sale`, {
        method: "POST",
        body: { salePriceDollars: saleForm.salePriceDollars, saleStartsAt: saleForm.saleStartsAt, saleEndsAt: saleForm.saleEndsAt },
      });
      if (res.ok) {
        toast({ title: "Sale activated" });
        setSaleProductId(null);
        loadProducts();
      } else {
        const err = await res.json();
        toast({ title: "Error", description: err.error, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleClearSale = async (productId: string) => {
    try {
      const res = await adminFetch(`/api/admin/shop/products/${productId}/sale`, {
        method: "POST",
        body: { clearSale: true },
      });
      if (res.ok) {
        toast({ title: "Sale cleared" });
        loadProducts();
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const startEdit = (p: DigitalProduct) => {
    setEditingId(p.id);
    setForm({
      title: p.title, slug: p.slug, description: p.description, shortDescription: p.shortDescription || "",
      priceDollars: (p.price / 100).toFixed(2), compareAtDollars: p.compareAtPrice ? (p.compareAtPrice / 100).toFixed(2) : "",
      fileUrl: p.fileUrl || "", coverImageUrl: p.coverImageUrl || "", category: p.category,
      tierTarget: p.tierTarget || "all", examTarget: p.examTarget || "", featured: p.featured || false,
    });
    setShowForm(true);
  };

  return (
    <div className="bg-white border-2 border-dashed border-primary/30 rounded-xl p-6 mb-8" data-testid="admin-product-manager">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" /> Manage Products ({products.length})
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setLocation("/admin/product-builder")} size="sm" variant="outline" data-testid="button-open-builder">
            <Palette className="w-4 h-4 mr-1" /> Product Builder
          </Button>
          <Button onClick={() => setLocation("/admin/product-builder?new=1")} size="sm" variant="outline" data-testid="button-create-product">
            <Plus className="w-4 h-4 mr-1" /> Create Product
          </Button>
          <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }} size="sm" data-testid="button-add-product">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>
          <Button onClick={() => setShowSync(!showSync)} size="sm" variant="outline" data-testid="button-show-sync">
            <ArrowRight className="w-4 h-4 mr-1" /> Sync
          </Button>
        </div>
      </div>

      {showSync && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-3" data-testid="panel-sync">
          <h4 className="font-semibold text-sm text-blue-900">{t("pages.shop.productSync")}</h4>
          <p className="text-xs text-blue-700">{t("pages.shop.exportProductsFromHereAnd")}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleExport} size="sm" variant="outline" data-testid="button-export-products">
              <Download className="w-4 h-4 mr-1" /> Export JSON
            </Button>
            <label className="cursor-pointer">
              <input type="file" accept=".json" className="hidden" onChange={handleImportFile} data-testid="input-import-file" />
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Import JSON
              </span>
            </label>
          </div>
          <div className="border-t border-blue-200 pt-3 mt-2">
            <p className="text-xs font-medium text-blue-900 mb-2">{t("pages.shop.pushToProduction")}</p>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.nursenest.ca"
                value={syncUrl}
                onChange={e => setSyncUrl(e.target.value)}
                className="flex-1 text-sm"
                data-testid="input-sync-url"
              />
              <Button onClick={handlePushToProduction} size="sm" disabled={syncing} data-testid="button-push-production">
                {syncing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-1" />}
                {syncing ? "Pushing..." : "Push"}
              </Button>
            </div>
            <p className="text-[10px] text-blue-600 mt-1">{t("pages.shop.exportsAllProductsFromThis")}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3" data-testid="form-product">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder={t("pages.shop.title")} value={form.title} onChange={e => setForm({...form, title: e.target.value})} data-testid="input-product-title" />
            <Input placeholder={t("pages.shop.slug")} value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} data-testid="input-product-slug" />
          </div>
          <Textarea placeholder={t("pages.shop.fullDescription")} value={form.description} onChange={e => setForm({...form, description: e.target.value})} data-testid="input-product-description" />
          <Input placeholder={t("pages.shop.shortDescription")} value={form.shortDescription} onChange={e => setForm({...form, shortDescription: e.target.value})} data-testid="input-product-short-desc" />
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder={t("pages.shop.price")} value={form.priceDollars} onChange={e => setForm({...form, priceDollars: e.target.value})} data-testid="input-product-price" />
            <Input placeholder={t("pages.shop.compareatPrice")} value={form.compareAtDollars} onChange={e => setForm({...form, compareAtDollars: e.target.value})} data-testid="input-product-compare-price" />
            <select className="border rounded px-3 py-2 text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})} data-testid="select-product-category">
              <option>{t("pages.shop.cramGuide")}</option>
              <option>{t("pages.shop.flashcardPack")}</option>
              <option>{t("pages.shop.printable")}</option>
              <option>{t("pages.shop.bundle")}</option>
              <option>{t("pages.shop.quickReference")}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><Image className="w-3 h-3" /> {t("pages.shop.coverImage")}</label>
              <div className="flex gap-1.5">
                <Input placeholder={t("pages.shop.coverImageUrl")} value={form.coverImageUrl} onChange={e => setForm({...form, coverImageUrl: e.target.value})} className="flex-1 text-xs" data-testid="input-product-cover" />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, "cover")} data-testid="input-upload-cover" />
                  <span className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${uploading === "cover" ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"}`}>
                    {uploading === "cover" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload
                  </span>
                </label>
              </div>
              {form.coverImageUrl && <p className="text-[10px] text-green-600 truncate">Attached: {form.coverImageUrl.split("/").pop()}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1"><FileText className="w-3 h-3" /> {t("pages.shop.documentPdf")}</label>
              <div className="flex gap-1.5">
                <Input placeholder={t("pages.shop.fileUrlPdf")} value={form.fileUrl} onChange={e => setForm({...form, fileUrl: e.target.value})} className="flex-1 text-xs" data-testid="input-product-file" />
                <label className="cursor-pointer">
                  <input type="file" accept=".pdf,.docx,.xlsx,.zip" className="hidden" onChange={e => handleFileUpload(e, "file")} data-testid="input-upload-file" />
                  <span className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${uploading === "file" ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"}`}>
                    {uploading === "file" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload
                  </span>
                </label>
              </div>
              {form.fileUrl && <p className="text-[10px] text-green-600 truncate">Attached: {form.fileUrl.split("/").pop()}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 items-center">
            <select className="border rounded px-3 py-2 text-sm" value={form.tierTarget} onChange={e => setForm({...form, tierTarget: e.target.value})} data-testid="select-product-tier">
              <option value="all">{t("pages.shop.allTiers")}</option>
              <option value="rpn">RPN</option>
              <option value="rn">RN</option>
              <option value="np">NP</option>
            </select>
            <Input placeholder={t("pages.shop.examTargetEgRexpn")} value={form.examTarget} onChange={e => setForm({...form, examTarget: e.target.value})} data-testid="input-product-exam" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} data-testid="checkbox-product-featured" />
              Featured
            </label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" data-testid="button-save-product">{editingId ? "Update" : "Create"} Product</Button>
            <Button onClick={() => { setShowForm(false); setEditingId(null); }} variant="ghost" size="sm"><X className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-2">
          {products.map(p => {
            const now = new Date();
            const hasSale = p.salePrice && p.saleStartsAt && p.saleEndsAt;
            const saleActive = hasSale && now >= new Date(p.saleStartsAt!) && now <= new Date(p.saleEndsAt!);
            const saleUpcoming = hasSale && now < new Date(p.saleStartsAt!);
            const saleExpired = hasSale && now > new Date(p.saleEndsAt!);
            return (
            <div key={p.id} className="bg-gray-50 rounded-lg p-3 space-y-2" data-testid={`admin-product-row-${p.slug}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{p.title}</span>
                  <span className="text-xs text-gray-400">{formatPrice(p.price)}</span>
                  {!p.isActive && <Badge variant="outline" className="text-xs text-red-500">{t("pages.shop.inactive")}</Badge>}
                  {saleActive && <Badge className="bg-green-100 text-green-700 text-[10px]" data-testid={`badge-sale-active-${p.slug}`}>SALE: {formatPrice(p.salePrice!)}</Badge>}
                  {saleUpcoming && <Badge className="bg-blue-100 text-blue-700 text-[10px]" data-testid={`badge-sale-upcoming-${p.slug}`}>{t("pages.shop.saleScheduled")}</Badge>}
                  {saleExpired && <Badge className="bg-gray-100 text-gray-500 text-[10px]">{t("pages.shop.saleExpired")}</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => startEdit(p)} variant="ghost" size="sm" data-testid={`button-edit-${p.slug}`}><Edit className="w-4 h-4" /></Button>
                  <Button
                    onClick={() => {
                      if (saleProductId === p.id) { setSaleProductId(null); return; }
                      setSaleProductId(p.id);
                      setSaleForm({
                        salePriceDollars: p.salePrice ? (p.salePrice / 100).toFixed(2) : "",
                        saleStartsAt: p.saleStartsAt ? new Date(p.saleStartsAt).toISOString().slice(0, 16) : "",
                        saleEndsAt: p.saleEndsAt ? new Date(p.saleEndsAt).toISOString().slice(0, 16) : "",
                      });
                    }}
                    variant="ghost" size="sm" data-testid={`button-sale-${p.slug}`}
                    title={t("pages.shop.manageSale")}
                  >
                    <Tag className={`w-4 h-4 ${saleActive ? "text-green-500" : "text-gray-400"}`} />
                  </Button>
                  {p.fileUrl && (
                    <Button
                      onClick={async () => {
                        try {
                          const res = await adminFetch(`/api/admin/shop/products/${p.id}/download`);
                          if (!res.ok) { toast({ title: "Download failed", variant: "destructive" }); return; }
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${p.slug || "product"}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          URL.revokeObjectURL(url);
                        } catch (e: any) {
                          toast({ title: "Download error", description: e.message, variant: "destructive" });
                        }
                      }}
                      variant="ghost" size="sm" data-testid={`button-download-${p.slug}`}
                      title={t("pages.shop.downloadFullPdf")}
                    >
                      <Download className="w-4 h-4 text-blue-500" />
                    </Button>
                  )}
                  <Button
                    onClick={async () => {
                      try {
                        const res = await adminFetch(`/api/admin/shop/products/${p.id}/generate-preview`, {
                          method: "POST",
                          body: { pageCount: 3 },
                        });
                        if (res.ok) {
                          toast({ title: "Preview generated" });
                          loadProducts();
                        } else {
                          const err = await res.json().catch(() => ({}));
                          toast({ title: "Preview Error", description: err.error || "Failed", variant: "destructive" });
                        }
                      } catch (e: any) {
                        toast({ title: "Error", description: e.message, variant: "destructive" });
                      }
                    }}
                    variant="ghost" size="sm" data-testid={`button-gen-preview-${p.slug}`}
                    title={t("pages.shop.generateWatermarkedPreview")}
                  >
                    <Shield className="w-4 h-4 text-amber-500" />
                  </Button>
                  <Button onClick={() => handleDelete(p.id)} variant="ghost" size="sm" data-testid={`button-delete-${p.slug}`}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                </div>
              </div>
              {saleProductId === p.id && (
                <div className="bg-white border border-green-200 rounded-lg p-3 space-y-2" data-testid={`panel-sale-${p.slug}`}>
                  <p className="text-xs font-semibold text-gray-700">Sale Settings for {p.title}</p>
                  <p className="text-[10px] text-gray-500">Regular price: {formatPrice(p.price)}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 block mb-0.5">Sale Price ($)</label>
                      <Input type="number" step="0.01" placeholder="e.g. 9.99" value={saleForm.salePriceDollars} onChange={e => setSaleForm(f => ({...f, salePriceDollars: e.target.value}))} className="h-7 text-xs" data-testid={`input-sale-price-${p.slug}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 block mb-0.5">{t("pages.shop.starts")}</label>
                      <Input type="datetime-local" value={saleForm.saleStartsAt} onChange={e => setSaleForm(f => ({...f, saleStartsAt: e.target.value}))} className="h-7 text-xs" data-testid={`input-sale-start-${p.slug}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 block mb-0.5">{t("pages.shop.ends")}</label>
                      <Input type="datetime-local" value={saleForm.saleEndsAt} onChange={e => setSaleForm(f => ({...f, saleEndsAt: e.target.value}))} className="h-7 text-xs" data-testid={`input-sale-end-${p.slug}`} />
                    </div>
                  </div>
                  {saleForm.salePriceDollars && Number(saleForm.salePriceDollars) > 0 && (
                    <p className="text-[10px] text-green-600 font-medium">
                      Discount: {Math.round((1 - (Number(saleForm.salePriceDollars) * 100) / p.price) * 100)}% off
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveSale(p.id)} size="sm" className="h-7 text-xs" data-testid={`button-save-sale-${p.slug}`}>
                      <Tag className="w-3 h-3 mr-1" /> Activate Sale
                    </Button>
                    {hasSale && (
                      <Button onClick={() => handleClearSale(p.id)} size="sm" variant="outline" className="h-7 text-xs text-red-500" data-testid={`button-clear-sale-${p.slug}`}>
                        Clear Sale
                      </Button>
                    )}
                    <Button onClick={() => setSaleProductId(null)} size="sm" variant="ghost" className="h-7 text-xs">{t("pages.shop.cancel")}</Button>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  const { t } = useI18n();
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  useEffect(() => {
    fetch("/api/shop/products")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["all", ...new Set(products.map(p => p.category))];
  const tiers = ["all", ...new Set(products.filter(p => p.tierTarget && p.tierTarget !== "all").map(p => p.tierTarget!))];
  const afterTier = tierFilter === "all" ? products : products.filter(p => p.tierTarget === tierFilter || p.tierTarget === "all");
  const filtered = categoryFilter === "all" ? afterTier : afterTier.filter(p => p.category === categoryFilter);
  const featured = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <AdminEditButton />
      <SEO
        title={t("pages.shop.nursingStudyGuidesCramBooklets")}
        description={t("pages.shop.downloadProfessionalNursingCramGuides")}
        keywords="nursing study guides, NCLEX cram guide, NCLEX-PN study materials, REx-PN study materials, nursing exam prep PDF"
        canonicalPath="/shop"
      />
      <Navigation />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <BreadcrumbNav />
        </div>
        <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 px-4" data-testid="section-shop-hero">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-primary/10 text-primary mb-4 px-4 py-1.5" data-testid="badge-shop">
              <ShoppingBag className="w-3 h-3 mr-1.5" /> {t("shop.hero.badge")}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-shop-title">
              {t("shop.hero.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6" data-testid="text-shop-subtitle">
              {t("shop.hero.subtitle")}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {t("shop.hero.instantDownload")}</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {t("shop.hero.clinicallyVerified")}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {t("shop.hero.examAligned")}</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {isAdmin && <AdminProductManager />}

          {tiers.length > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8 flex-wrap" data-testid="section-tier-filters">
              {tiers.map(tier => (
                <Button
                  key={tier}
                  variant={tierFilter === tier ? "default" : "outline"}
                  size="sm"
                  className={tierFilter === tier ? "bg-primary text-white" : ""}
                  onClick={() => setTierFilter(tier)}
                  data-testid={`button-tier-${tier}`}
                >
                  {tier === "all" ? t("shop.filter.allTiers") : tier.toUpperCase()}
                </Button>
              ))}
            </div>
          )}

          {featured.length > 0 && (
            <section className="mb-12" data-testid="section-featured-products">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold" data-testid="text-featured-heading">{t("shop.featured.title")}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {categories.length > 2 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap" data-testid="section-shop-filters">
              <Filter className="w-4 h-4 text-gray-400" />
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={categoryFilter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(cat)}
                  data-testid={`button-filter-${cat}`}
                >
                  {cat === "all" ? t("shop.allProducts") : cat}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-16 text-gray-400" data-testid="text-shop-loading">{t("shop.loading")}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16" data-testid="text-shop-empty">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">{t("shop.empty.title")}</h3>
              <p className="text-gray-500 text-sm">{t("shop.empty.subtitle")}</p>
            </div>
          ) : (
            <section data-testid="section-all-products">
              <h2 className="text-xl font-bold mb-6" data-testid="text-all-products-heading">
                {categoryFilter === "all" ? t("shop.allProducts") : categoryFilter}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>

        <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-primary/10" data-testid="section-shop-cta">
          <div className="max-w-2xl mx-auto text-center">
            <Crown className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-3" data-testid="text-shop-cta-title">{t("shop.cta.title")}</h2>
            <p className="text-gray-600 mb-6" data-testid="text-shop-cta-subtitle">{t("shop.cta.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocaleLink href="/pricing">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-shop-pricing">
                  {t("shop.cta.button")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/flashcards">
                <Button size="lg" variant="outline" className="px-8" data-testid="button-shop-flashcards">
                  {t("shop.cta.flashcards")}
                </Button>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

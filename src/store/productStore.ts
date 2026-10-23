// src/store/productStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as seedProducts, type Product } from '@/data/products';

interface ProductStoreState {
  products: Product[];
  isOfflineMode: boolean;
  setProducts: (products: Product[], isOffline?: boolean) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkImportProducts: (newProducts: Product[]) => void;
  resetToSeed: () => void;
}

export const useProductStore = create<ProductStoreState>()(
  persist(
    (set) => ({
      products: seedProducts,
      isOfflineMode: false,

      setProducts: (products, isOffline = false) =>
        set({
          products: products.length > 0 ? products : seedProducts,
          isOfflineMode: isOffline,
        }),

      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            String(p.id) === String(id) ? { ...p, ...data } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => String(p.id) !== String(id)),
        })),

      bulkImportProducts: (newProducts) =>
        set({
          products: newProducts,
          isOfflineMode: true,
        }),

      resetToSeed: () =>
        set({
          products: seedProducts,
          isOfflineMode: true,
        }),
    }),
    {
      name: 'bk_inventory_storage_v1',
    }
  )
);
// store/categoryStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CategoryState {
  categories: any[];
  loading: boolean;
  error: string | null;
  selectedCategory: any | null;
}

interface CategoryActions {
  setCategories: (categories: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: any | null) => void;
  addCategory: (category: any) => void;
  updateCategory: (category: any) => void;
  deleteCategory: (id: string) => void;
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: string) => Promise<void>;
}

export type CategoryStore = CategoryState & CategoryActions;

export const useCategoryStore = create<CategoryStore>()(
  devtools((set, get) => ({
    categories: [],
    loading: false,
    error: null,
    selectedCategory: null,

    setCategories: (categories) => set({ categories }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSelectedCategory: (category) => set({ selectedCategory: category }),

    addCategory: (category) => set((state) => ({
      categories: [...state.categories, category]
    })),

    updateCategory: (updatedCategory) => set((state) => ({
      categories: state.categories.map(cat => 
        cat._id === updatedCategory._id ? updatedCategory : cat
      )
    })),

    deleteCategory: (id) => set((state) => ({
      categories: state.categories.filter(cat => cat._id !== id)
    })),

    // fetchCategories: async () => {
    //   set({ loading: true, error: null });
    //   try {
    //     const response = await fetch('/api/user/Addcategory');
    //     if (!response.ok) throw new Error('Failed to fetch categories');
    //     const data = await response.json();
    //     set({ categories: data.categories, loading: false });
    //   } catch (error) {
    //     set({ error: (error as Error).message, loading: false });
    //   }
    // },

    // fetchCategoryById: async (id: string) => {
    //   set({ loading: true, error: null });
    //   try {
    //     const response = await fetch(`/api/user/Addcategory/${id}`);
    //     if (!response.ok) throw new Error('Failed to fetch category');
    //     const data = await response.json();
    //     set({ selectedCategory: data.category, loading: false });
    //   } catch (error) {
    //     set({ error: (error as Error).message, loading: false });
    //   }
    // }
  }))
);
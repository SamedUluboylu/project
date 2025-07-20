// This file is kept for compatibility but not used since we're using .NET backend
// Remove supabase imports from other files and use apiService instead

export const supabase = {
  // Mock supabase object for compatibility
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  })
}
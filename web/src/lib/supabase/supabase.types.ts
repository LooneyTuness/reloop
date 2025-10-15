export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          level: number
          sort_order: number
          is_active: boolean
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          level?: number
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          level?: number
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      items: {
        Row: {
          id: string
          name?: string
          title?: string
          price: number
          old_price?: number | null
          condition?: string
          size?: string | null
          brand?: string | null
          category_id?: string | null
          images?: string[] | null
          seller_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          user_email?: string | null
          is_active?: boolean
          quantity?: number
          sold_at?: string | null
          buyer_id?: string | null
          reserved_until?: string | null
          reserved_by?: string | null
          deleted_at?: string | null
          seller?: string | null
          description?: string
        }
        Insert: {
          id?: string
          name?: string
          title?: string
          price: number
          old_price?: number | null
          condition?: string
          size?: string | null
          brand?: string | null
          category_id?: string | null
          images?: string[] | null
          seller_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          user_email?: string | null
          is_active?: boolean
          quantity?: number
          sold_at?: string | null
          buyer_id?: string | null
          reserved_until?: string | null
          reserved_by?: string | null
          deleted_at?: string | null
          seller?: string | null
          description?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          price?: number
          old_price?: number | null
          condition?: string
          size?: string | null
          brand?: string | null
          category_id?: string | null
          images?: string[] | null
          seller_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          user_email?: string | null
          is_active?: boolean
          quantity?: number
          sold_at?: string | null
          buyer_id?: string | null
          reserved_until?: string | null
          reserved_by?: string | null
          deleted_at?: string | null
          seller?: string | null
          description?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          name: string
          price: number
          quantity: number
          image_url: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          name: string
          price: number
          quantity: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          name?: string
          price?: number
          quantity?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          total_amount: number
          payment_method: string
          status: string
          full_name?: string
          email?: string
          phone?: string
          address_line1?: string
          address_line2?: string
          city?: string
          postal_code?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          total_amount: number
          payment_method: string
          status: string
          full_name?: string
          email?: string
          phone?: string
          address_line1?: string
          address_line2?: string
          city?: string
          postal_code?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          total_amount?: number
          payment_method?: string
          status?: string
          full_name?: string
          email?: string
          phone?: string
          address_line1?: string
          address_line2?: string
          city?: string
          postal_code?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          item_id: string
          vendor_id: string | null
          buyer_name: string | null
          buyer_email: string | null
          buyer_phone: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Insert: {
          id?: string
          order_id: string
          item_id: string
          vendor_id?: string | null
          buyer_name?: string | null
          buyer_email?: string | null
          buyer_phone?: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          item_id?: string
          vendor_id?: string | null
          buyer_name?: string | null
          buyer_email?: string | null
          buyer_phone?: string | null
          quantity?: number
          price?: number
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          order_id: string | null
          item_name: string | null
          order_date: string | null
          is_read: boolean
          is_dismissed: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type?: string
          title: string
          message: string
          order_id?: string | null
          item_name?: string | null
          order_date?: string | null
          is_read?: boolean
          is_dismissed?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          order_id?: string | null
          item_name?: string | null
          order_date?: string | null
          is_read?: boolean
          is_dismissed?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_sales: {
        Row: {
          id: string
          vendor_id: string
          item_id: string
          order_id: string
          item_title: string
          item_price: number
          item_category: string | null
          item_photos: string[]
          quantity_sold: number
          total_amount: number
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          sale_date: string
          payment_method: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          item_id: string
          order_id: string
          item_title: string
          item_price: number
          item_category?: string | null
          item_photos: string[]
          quantity_sold?: number
          total_amount: number
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          sale_date?: string
          payment_method?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          item_id?: string
          order_id?: string
          item_title?: string
          item_price?: number
          item_category?: string | null
          item_photos?: string[]
          quantity_sold?: number
          total_amount?: number
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          sale_date?: string
          payment_method?: string | null
          created_at?: string
        }
        Relationships: []
      }
      seller_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          store_name: string | null
          website_social: string | null
          product_description: string
          understands_application: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
          reviewed_by: string | null
          reviewed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          store_name?: string | null
          website_social?: string | null
          product_description: string
          understands_application?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          store_name?: string | null
          website_social?: string | null
          product_description?: string
          understands_application?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          role: 'admin' | 'seller'
          is_approved: boolean
          full_name?: string
          phone?: string
          bio?: string
          location?: string
          website?: string
          avatar_url?: string
          business_name?: string
          business_type?: string
          tax_id?: string
          bank_account?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          role: 'admin' | 'seller'
          is_approved?: boolean
          full_name?: string
          phone?: string
          bio?: string
          location?: string
          website?: string
          avatar_url?: string
          business_name?: string
          business_type?: string
          tax_id?: string
          bank_account?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          role?: 'admin' | 'seller'
          is_approved?: boolean
          full_name?: string
          phone?: string
          bio?: string
          location?: string
          website?: string
          avatar_url?: string
          business_name?: string
          business_type?: string
          tax_id?: string
          bank_account?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_invites: {
        Row: {
          id: string
          invite_code: string
          email: string
          invited_by: string
          status: 'pending' | 'accepted' | 'expired'
          expires_at: string
          created_at: string
          accepted_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          invite_code: string
          email: string
          invited_by: string
          status?: 'pending' | 'accepted' | 'expired'
          expires_at: string
          created_at?: string
          accepted_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          invite_code?: string
          email?: string
          invited_by?: string
          status?: 'pending' | 'accepted' | 'expired'
          expires_at?: string
          created_at?: string
          accepted_at?: string | null
          notes?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      category_hierarchy: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          level: number
          parent_id: string | null
          sort_order: number
          is_active: boolean
          parent_name: string | null
          parent_slug: string | null
          grandparent_name: string | null
          grandparent_slug: string | null
          full_path: string[] | null
        }
        Relationships: []
      }
      vendor_sales_summary: {
        Row: {
          vendor_id: string
          total_sales: number
          total_revenue: number
          total_items_sold: number
          average_sale_value: number
          first_sale: string
          last_sale: string
          categories_sold: number
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

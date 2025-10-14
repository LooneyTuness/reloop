import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabase.admin';
import { Category, CategoryHierarchy } from '@/types/category';

// GET /api/categories - Get all categories with hierarchy
export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const parentId = searchParams.get('parent_id');
    const includeInactive = searchParams.get('include_inactive') === 'true';

    let query = supabase
      .from('category_hierarchy')
      .select('*')
      .order('level', { ascending: true })
      .order('sort_order', { ascending: true });

    // Filter by level if specified
    if (level) {
      query = query.eq('level', parseInt(level));
    }

    // Filter by parent_id if specified
    if (parentId) {
      query = query.eq('parent_id', parentId);
    }

    // Filter out inactive categories unless explicitly requested
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;

    const body = await request.json();
    const { name, slug, description, parent_id, level, sort_order } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        parent_id: parent_id || null,
        level: level || 0,
        sort_order: sort_order || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error in categories POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

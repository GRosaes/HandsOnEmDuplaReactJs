// src/services/categoryService.js
import supabase from './supabase';

const categoryService = {
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');
            
        if (error) {
            console.error('Erro ao buscar categorias:', error);
            throw error;
        }
        
        return data;
    },

    async createCategory(category) {
        const { data, error } = await supabase
            .from('categories')
            .insert([{
                name: category.name,
                description: category.description
            }])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }

        return data;
    },

    async updateCategory(id, category) {
        const { data, error } = await supabase
            .from('categories')
            .update({
                name: category.name,
                description: category.description
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar categoria:', error);
            throw error;
        }

        return data;
    },

    async deleteCategory(id) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir categoria:', error);
            throw error;
        }
        
        return true;
    }
};

export default categoryService;

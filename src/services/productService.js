import supabase from './supabase';

const productService = {
    async getProductsByPage(page = 1, limit = 12, categoryId = '') {
        const offset = (page - 1) * limit;
        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(*)
            `, { count: 'exact' });

        // Apply category filter if provided
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error, count } = await query
            .range(offset, offset + limit - 1)
            .order('id', { ascending: false });

        if (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }

        return {
            products: data,
            total: count,
            totalPages: Math.ceil(count / limit)
        };
    },

    async getProductById(id) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Erro ao buscar produto:', error);
            throw error;
        }
        return data;
    },

    async createProduct(product) {
        const { image_url, ...productData } = product;

        // Primeiro, insira o produto com seus dados básicos
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }

        // Se uma imagem foi fornecida como URL, atualize o produto
        if (image_url) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ image_url })
                .eq('id', data.id);

            if (updateError) {
                console.error('Erro ao atualizar URL da imagem:', updateError);
                throw updateError;
            }
        }

        return data;
    },

    async updateProduct(id, product) {
        const { error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
        return true;
    },

    async deleteProduct(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir produto:', error);
            throw error;
        }
        return true;
    },

    async uploadImage(file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError, data } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

        if (uploadError) {
            console.error('Erro ao fazer upload da imagem:', uploadError);
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        return publicUrl;
    }
};

export default productService;
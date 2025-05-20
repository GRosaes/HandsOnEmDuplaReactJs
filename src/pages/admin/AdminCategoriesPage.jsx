// src/pages/admin/AdminCategoriesPage.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import categoryService from '@services/categoryService';

const AdminCategoriesPage = () => {
    const queryClient = useQueryClient();
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: ''
    });

    // Lista de categorias
    const {
        data: categories,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories
    });

    // Mutation para criar categoria
    const createCategoryMutation = useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Categoria criada com sucesso!', { icon: '✅' });
            setNewCategory({ name: '', description: '' });
        },
        onError: (err) => toast.error(`Erro ao criar categoria: ${err.message}`, { icon: '❌' })
    });

    // Mutation para atualizar categoria
    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, ...data }) => categoryService.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Categoria atualizada com sucesso!', { icon: '✅' });
            setEditingCategory(null);
        },
        onError: (err) => toast.error(`Erro ao atualizar categoria: ${err.message}`, { icon: '❌' })
    });

    // Mutation para excluir categoria
    const deleteCategoryMutation = useMutation({
        mutationFn: categoryService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Categoria excluída com sucesso!', { icon: '🗑️' });
        },
        onError: (err) => toast.error(`Erro ao excluir categoria: ${err.message}`, { icon: '❌' })
    });

    const handleSubmitNew = (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;
        createCategoryMutation.mutate(newCategory);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        if (!editingCategory.name.trim()) return;
        updateCategoryMutation.mutate(editingCategory);
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.')) {
            deleteCategoryMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger" role="alert">
                Erro ao carregar categorias: {error.message}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-header text-bg-light">
                            <h2 className="mb-0">Nova Categoria</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmitNew}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="newName" className="form-label">Nome</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="newName"
                                                value={newCategory.name}
                                                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="newDescription" className="form-label">Descrição</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="newDescription"
                                                value={newCategory.description}
                                                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2 d-flex align-items-end">
                                        <button
                                            type="submit"
                                            className="btn btn-success w-100"
                                            disabled={createCategoryMutation.isPending || !newCategory.name.trim()}>
                                            {createCategoryMutation.isPending ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : 'Adicionar'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header text-bg-light">
                            <h2 className="mb-0">Categorias</h2>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories?.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4">
                                                    Nenhuma categoria cadastrada.
                                                </td>
                                            </tr>
                                        )}
                                        {categories?.map(category => (
                                            <tr key={category.id}>
                                                <td>
                                                    {editingCategory?.id === category.id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editingCategory.name}
                                                            onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                                                        />
                                                    ) : (
                                                        category.name
                                                    )}
                                                </td>
                                                <td>
                                                    {editingCategory?.id === category.id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editingCategory.description}
                                                            onChange={(e) => setEditingCategory(prev => ({ ...prev, description: e.target.value }))}
                                                        />
                                                    ) : (
                                                        category.description
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {editingCategory?.id === category.id ? (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-success me-2"
                                                                onClick={handleSubmitEdit}
                                                                disabled={updateCategoryMutation.isPending}>
                                                                Salvar
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() => setEditingCategory(null)}
                                                                disabled={updateCategoryMutation.isPending}>
                                                                Cancelar
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-outline-warning me-2"
                                                                onClick={() => setEditingCategory(category)}>
                                                                Alterar
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDelete(category.id)}>
                                                                Excluir
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCategoriesPage;

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/index';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health & Beauty', 'Automotive', 'Food & Beverages', 'Other'];

export default function VendorProductForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', price: '', compareAtPrice: '',
        category: 'Electronics', inventory: '', sku: '', images: '',
    });

    useEffect(() => {
        if (isEdit) {
            productService.getById(id).then(r => {
                const p = r.data.data.product;
                setForm({
                    title: p.title, description: p.description, price: p.price,
                    compareAtPrice: p.compareAtPrice || '', category: p.category,
                    inventory: p.inventory, sku: p.sku || '', images: p.images?.join(', ') || '',
                });
            });
        }
    }, [id]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            ...form,
            price: Number(form.price),
            compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
            inventory: Number(form.inventory),
            images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        try {
            if (isEdit) {
                await productService.update(id, data);
                toast.success('Product updated!');
            } else {
                await productService.create(data);
                toast.success('Product created!');
            }
            navigate('/vendor/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product.');
        } finally { setLoading(false); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl"
        >
            <h1 className="text-2xl font-bold text-surface-900 mb-6 tracking-tight">{isEdit ? 'Edit' : 'Add'} Product</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-surface-200/60 p-6 space-y-4">
                <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
                    <textarea
                        name="description" value={form.description} onChange={handleChange} rows={4}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-surface-300 hover:border-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Price (₹)" type="number" name="price" value={form.price} onChange={handleChange} required min={0} />
                    <Input label="Compare Price" type="number" name="compareAtPrice" value={form.compareAtPrice} onChange={handleChange} min={0} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Select label="Category" name="category" value={form.category} onChange={handleChange} options={CATEGORIES} />
                    <Input label="Inventory" type="number" name="inventory" value={form.inventory} onChange={handleChange} required min={0} />
                </div>
                <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />
                <Input label="Image URLs (comma separated)" name="images" value={form.images} onChange={handleChange} placeholder="https://..." />
                <div className="flex gap-3 pt-2">
                    <Button variant="secondary" type="button" onClick={() => navigate('/vendor/products')}>Cancel</Button>
                    <Button type="submit" loading={loading}>{isEdit ? 'Update' : 'Create'} Product</Button>
                </div>
            </form>
        </motion.div>
    );
}

// components/admin/ProductForm.js
"use client";

import { useState, useEffect } from "react";
import {
    Input,
    Textarea,
    Select,
    SelectItem,
    Button,
    Card,
    CardBody,
} from "@nextui-org/react";
import { FiUpload, FiX, FiDollarSign, FiPackage, FiAlertCircle } from "react-icons/fi";
import { getImageUrl } from "@/utils/imageHelper";

export default function ProductForm({
    initialData = null,
    categories = [],
    onSubmit,
    isSubmitting,
    onCancel
}) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        buying_price: '',
        stock: '',
        stock_alert_qty: '5',
        category_id: '',
        description: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [profitPreview, setProfitPreview] = useState(0);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                buying_price: initialData.buying_price || '',
                stock: initialData.stock || '',
                stock_alert_qty: initialData.stock_alert_qty || '5',
                category_id: initialData.category_id || '',
                description: initialData.description || ''
            });
            if (initialData.images?.[0]) {
                setImagePreview(getImageUrl(initialData.images[0].path));
            }
        }
    }, [initialData]);

    useEffect(() => {
        const price = parseFloat(formData.price) || 0;
        const buyingPrice = parseFloat(formData.buying_price) || 0;
        setProfitPreview(price - buyingPrice);
    }, [formData.price, formData.buying_price]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, image: "Image size should be less than 2MB" });
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setErrors({ ...errors, image: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Product name is required";
        if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
        if (!formData.buying_price || formData.buying_price <= 0) newErrors.buying_price = "Valid buying price is required";
        if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock quantity is required";
        if (!formData.category_id) newErrors.category_id = "Category is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData, selectedImage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardBody className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>

                    <Input
                        label="Product Name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        errorMessage={errors.name}
                        isInvalid={!!errors.name}
                        isRequired
                        size="lg"
                    />

                    <Select
                        label="Category"
                        placeholder="Select category"
                        selectedKeys={formData.category_id ? [formData.category_id.toString()] : []}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        errorMessage={errors.category_id}
                        isInvalid={!!errors.category_id}
                        isRequired
                        size="lg"
                    >
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </Select>

                    <Textarea
                        label="Description"
                        placeholder="Product description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                    />
                </CardBody>
            </Card>

            {/* Pricing Information */}
            <Card>
                <CardBody className="space-y-4">
                    <h3 className="text-lg font-semibold">Pricing Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Selling Price (TSh)"
                            type="number"
                            placeholder="0"
                            startContent={<FiDollarSign className="text-gray-400" />}
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            errorMessage={errors.price}
                            isInvalid={!!errors.price}
                            isRequired
                            size="lg"
                        />

                        <Input
                            label="Buying Price (TSh)"
                            type="number"
                            placeholder="0"
                            startContent={<FiDollarSign className="text-gray-400" />}
                            value={formData.buying_price}
                            onChange={(e) => setFormData({ ...formData, buying_price: e.target.value })}
                            errorMessage={errors.buying_price}
                            isInvalid={!!errors.buying_price}
                            isRequired
                            size="lg"
                        />
                    </div>

                    {profitPreview !== 0 && (
                        <div className={`p-4 rounded-lg ${profitPreview > 0 ? 'bg-green-50 border border-green-200' : profitPreview < 0 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Expected Profit:</span>
                                <span className={`text-xl font-bold ${profitPreview > 0 ? 'text-green-600' : profitPreview < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                    TSh {profitPreview.toLocaleString()}
                                </span>
                            </div>
                            {profitPreview < 0 && (
                                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                                    <FiAlertCircle /> Warning: Selling price is less than buying price!
                                </p>
                            )}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Stock Information */}
            <Card>
                <CardBody className="space-y-4">
                    <h3 className="text-lg font-semibold">Stock Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Stock Quantity"
                            type="number"
                            placeholder="0"
                            startContent={<FiPackage className="text-gray-400" />}
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            errorMessage={errors.stock}
                            isInvalid={!!errors.stock}
                            isRequired
                            size="lg"
                        />

                        <Input
                            label="Stock Alert Quantity"
                            type="number"
                            placeholder="5"
                            description="Alert when stock falls below this number"
                            value={formData.stock_alert_qty}
                            onChange={(e) => setFormData({ ...formData, stock_alert_qty: e.target.value })}
                            size="lg"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Product Image */}
            <Card>
                <CardBody className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Image</h3>

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover rounded-lg shadow-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                >
                                    <FiX size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-2">
                                    <label htmlFor="image-upload" className="cursor-pointer text-primary hover:text-primary-dark">
                                        Click to upload
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
                            </div>
                        )}
                    </div>
                    {errors.image && <p className="text-danger text-sm">{errors.image}</p>}
                </CardBody>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t">
                <Button variant="flat" onPress={onCancel} size="lg">
                    Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isSubmitting} size="lg">
                    {initialData ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    );
}
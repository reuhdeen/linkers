import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchQueryData } from "../api/fetchData";
import ProductDetails from "../api/productDetails";
import ProductInventory from "../api/singleProductInventory";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/loading.css";
import "../css/tables.css";
import "../css/forms.css";
import EditModal from "../api/editModal";
import InsertVariant from "../api/insertVariantModal";

function ProductDetailsPage() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  //edit details
  const [editDetailsModalOpen, setEditDetailsModalOpen] = useState(false);
  const [editDetailsData, setEditDetailsData] = useState(null);
  // 🛠️ Open Edit Modal with Selected Data
  const handleOpenEditDetailsModal = (category) => {
    setEditDetailsData(category);
    setEditDetailsModalOpen(true);
  };
  // 🛠️ Close Edit Modal
  const handleCloseEditDetailsModal = () => {
    setEditDetailsModalOpen(false);
    setEditDetailsData(null);
  };

  //insert Variant
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [insertData, setInsertData] = useState(null);
  // 🛠️ Open insert Modal with Selected Data
  const handleOpenInsertModal = (category) => {
    setInsertData(category);
    setInsertModalOpen(true);
  };
  // 🛠️ Close insert Modal
  const handleCloseInsertModal = () => {
    setInsertModalOpen(false);
    setInsertData(null);
  };
  // Function to fetch product and inventory data
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      // Fetch product data
      const productWhereClause = `products.product_id = '${productId}'`;
      const productData = await fetchQueryData(token, {
        table:
          "iposarv3.products INNER JOIN categories ON categories.category_id = products.category_id INNER JOIN product_types ON products.product_type_id = product_types.product_type_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id LEFT JOIN product_details ON products.product_id = product_details.product_id",
        columns:
          "products.*, products.product_id AS ProdID, product_details.*, categories.name AS categoryName, product_types.name AS productTypeName, suppliers.name AS supplierName",
        where: productWhereClause,
      });

      if (productData.length > 0) {
        setProduct(productData[0]); // Set fetched product data
      }

      // Fetch inventory data
      const inventoryData = await fetchQueryData(token, {
        table:
          "products p INNER JOIN product_variants pv ON p.product_id = pv.product_id INNER JOIN variant_attributes va ON pv.product_variant_id = va.product_variant_id INNER JOIN attribute_values av ON va.attribute_value_id = av.attribute_value_id INNER JOIN attributes a ON av.attribute_id = a.attribute_id INNER JOIN inventory i ON pv.product_variant_id = i.product_variant_id INNER JOIN warehouses w ON i.warehouse_id = w.warehouse_id INNER JOIN inventory_type it ON i.inventory_type_id = it.inventory_type_id",
        columns:
          "p.product_id, p.name AS product_name, pv.product_variant_id, pv.sku AS variant_sku, av.attribute_value_id, a.attribute_name AS attribute_name, av.value AS attribute_value, i.inventory_id, i.warehouse_id, w.name AS WName, i.inventory_type_id, it.name AS inventory_type_name, i.quantity_in_stock, i.reorder_level, i.batch_number, i.expiration_date, i.storage_zone",
        where: `p.product_id = '${productId}'`, // Only fetch inventory for the selected product
      });

      setInventory(inventoryData); // Set fetched inventory data
    } catch (error) {
      console.error("Error fetching product or inventory:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails(); // Fetch product and inventory on component mount
  }, [productId]);

  const handleEditDetails = () => {
    // logic to open edit modal or route
  };

  const handleInsertInventory = () => {
    // logic to add inventory
  };

  const columns = [
    { name: "Img", key: "ProdID" },
    { name: "Barcode", key: "barcode" },
    { name: "Name", key: "name" },
    { name: "Category", key: "categoryName" },
    { name: "Product Type", key: "productTypeName" },
    { name: "Supplier", key: "supplierName" },
    { name: "", key: "edit" },
  ];
  const columnsMap = {
    ...columns.reduce((acc, col) => {
      if (col.key && col.name) acc[col.key] = col.name;
      return acc;
    }, {}),
    description: "Description",
    brand_name: "Brand",
    batch_number: "Batch No.",
    model_number: "Model No.",
    serial_number: "Serial No.",
    specifications: "Specifications",
    warranty_period: "Warranty",
    tax_class: "Tax Class",
    warehouse_zone: "Warehouse Zone",
    media_url: "Media URL",
    status: "Status",
    // created_at: "Created At",
    // updated_at: "Updated At",
    // add more columns here...
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="container-fluid">
      <div className="row">
        <h2>Product Details</h2>
        <div className="col-md-8">
          <div className="card p-3">
            {/* Ensure product is not null or undefined */}
            <ProductDetails
              product={product}
              columnsMap={columnsMap}
              onEdit={handleOpenEditDetailsModal}
              onInsert={handleOpenInsertModal}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <ProductInventory
              inventory={inventory}
              onEdit={handleInsertInventory}
            />
          </div>
        </div>
      </div>

      <EditModal
        isOpen={editDetailsModalOpen}
        onClose={handleCloseEditDetailsModal}
        data={editDetailsData}
        fields={[
          { key: "description", label: "Description", type: "text" },
          { key: "model_number", label: "Model Number", type: "text" },
          { key: "specifications", label: "Specifications", type: "text" },
          { key: "warranty_period", label: "Warranty Period", type: "text" },
          { key: "serial_number", label: "Serial Number", type: "text" },
          { key: "batch_number", label: "Batch Number", type: "text" },
          { key: "media_url", label: "Media URL", type: "text" },
        ]}
        onSubmit={() => window.location.reload()} // Refresh categories after edit
        apiEndpoint="/update/product_details"
        primaryKey="product_detail_id"
        title="Edit Product Details"
      />

      <InsertVariant
        isOpen={insertModalOpen}
        onClose={handleCloseInsertModal}
        data={insertData}
        fields={[
          { key: "name", label: "Product Name", type: "text" },
          { key: "barcode", label: "Barcode", type: "text" },
          { key: "category_id", label: "Category", type: "" },
          { key: "product_type_id", label: "Product Type", type: "" },
          { key: "supplier_id", label: "Supplier", type: "" },
        ]}
        onSubmit={() => window.location.reload()} // Refresh categories after edit
        apiEndpoint="/update/products"
        primaryKey="product_id"
        title="Add Variant"
      />
    </div>
  );
}

export default ProductDetailsPage;

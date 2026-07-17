import { useParams } from "react-router-dom";

const ProductListPage = () => {
  const params = useParams();

  const categoryId = params.category?.split("-").slice(-1)[0];
  const subCategoryId = params.subcategory?.split("-").slice(-1)[0];

  return (
    <section className="mx-auto px-4 py-6">
      <h1 className="mb-2 font-semibold text-lg">Product List Page</h1>
      <p className="text-secondary-100 text-sm">
        categoryId: <span className="font-medium">{categoryId}</span>
      </p>
      <p className="text-secondary-100 text-sm">
        subCategoryId: <span className="font-medium">{subCategoryId}</span>
      </p>
    </section>
  );
};

export default ProductListPage;

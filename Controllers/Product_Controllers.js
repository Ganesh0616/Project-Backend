const Products = require("../Models/Products");
const File = require("../Models/File");

// GET all products
const getproduct = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// GET single product
const getsingle = async (req, res) => {
  const id = req.params.id;
  try {
    const single = await Products.findById(id);
    res.status(200).json(single);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// POST product with file
const addProductsWithFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { name, price, size, description, category, weight, gender, stock } = req.body;
    console.log("Incoming data :",req.body);
    
    if (!name || !price || !description || !category || !stock || !weight) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const product = new Products({
      name,
      price,
      size,
      description,
      category: Array.isArray(category) ? category : [category],
      weight: weight || "Nil",
      gender,
      stock,
      imageurl: req.file.path,
      publicId: req.file.filename,
    });

    await product.save();
    res.status(201).json({ message: "Product uploaded successfully!", product });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// PATCH
const updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Products.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) return res.status(404).json("No Product Found");
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// DELETE single
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const Data = await Products.findByIdAndDelete(id);
    if (!Data) return res.status(404).json("No Product Found");
    res.status(200).json(Data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// DELETE many
const Many_delete = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids?.length) return res.status(404).json({ message: "No Product ID given" });

    const delete_many = await Products.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${delete_many.deletedCount} Products deleted` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getproduct,
  getsingle,
  addProductsWithFile,
  updateProduct,
  deleteProduct,
  Many_delete,
};

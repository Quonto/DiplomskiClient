import { useEffect, useState } from "react";
import "./adminPanel.css";
import axios from "axios";

import ChangeCategory from "../../components/changeCategory/ChangeCategory";
import ChangeProductInformation from "../../components/changeProductInformation/ChangeProductInformation";
import ChangePlace from "../../components/changePlace/ChangePlace";
import ChangeGroups from "../../components/changeGroups/ChangeGroups";
import ChangeProduct from "../../components/changeProduct/ChangeProduct";
const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://localhost:7113/Category/FetchCategoriesAndGroups"
      );
      response && setCategories([{ name: "" }, ...response.data]);
    };
    fetchCategories();
    console.log("Pribavljene kategorije");
  }, []);

  useEffect(() => {
    if (selectedCategory) setGroups([{ name: "" }, ...selectedCategory.groups]);
    console.log("Setovane grupe");
  }, [selectedCategory]);

  return (
    <div className="admin-panel-component">
      <section className="admin-panel">
        <ChangeProductInformation
          groups={groups}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          setGroups={setGroups}
          selectedCategory={selectedCategory}
        />
        <ChangePlace />
      </section>
      {categories.length !== 0 && (
        <ChangeCategory categories={categories} setCategories={setCategories} />
      )}
      <ChangeGroups categories={categories} />
      <ChangeProduct categories={categories} groups={groups} />
    </div>
  );
};

export default AdminPanel;

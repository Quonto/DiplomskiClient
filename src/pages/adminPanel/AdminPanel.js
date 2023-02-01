import { useEffect, useState } from "react";
import "./adminPanel.css";
import { CircularProgress } from "@mui/material";
import axios from "axios";

import ChangeCategory from "../../components/changeCategory/ChangeCategory";
import ChangeProductInformation from "../../components/changeProductInformation/ChangeProductInformation";
import ChangePlace from "../../components/changePlace/ChangePlace";
import ChangeGroups from "../../components/changeGroups/ChangeGroups";
import ChangeProduct from "../../components/changeProduct/ChangeProduct";
import ChangeUser from "../../components/changeUser/ChangeUser";
const AdminPanel = () => {
  const names = [
    "Informacije proizvoda",
    "Kategorije",
    "Grupe",
    "Proizvodi",
    "Korisnici",
  ];

  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChangeCategory = (index) => {
    setValue(index);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          "https://localhost:7113/Category/FetchCategoriesAndGroups"
        );
      } catch (error) {
        return;
      }
      response && setCategories([{ name: "" }, ...response.data]);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) setGroups([{ name: "" }, ...selectedCategory.groups]);
  }, [selectedCategory]);

  return (
    <div className="admin-panel-component">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {" "}
          <div className="ap-categories">
            {names.map((name, index) => {
              return (
                <button
                  className={`ap-category-button ${
                    index === value && "active"
                  } `}
                  key={index}
                  onClick={() => handleChangeCategory(index)}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <section className="admin-panel">
            {value === 0 && (
              <>
                <ChangeProductInformation
                  groups={groups}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                  setGroups={setGroups}
                  selectedCategory={selectedCategory}
                />
                <ChangePlace />
              </>
            )}

            {categories.length !== 0 && value === 1 && (
              <ChangeCategory
                categories={categories}
                setCategories={setCategories}
              />
            )}
            {value === 2 && <ChangeGroups categories={categories} />}

            {value === 3 && (
              <ChangeProduct categories={categories} groups={groups} />
            )}
            {value === 4 && <ChangeUser />}
          </section>{" "}
        </>
      )}
    </div>
  );
};

export default AdminPanel;

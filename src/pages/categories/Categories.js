import { useEffect, useState } from "react";
import "./categories.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://localhost:7113/Category/FetchCategories"
      );
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedCategory) {
        const response = await axios.get(
          `https://localhost:7113/Category/FetchGroups?id_category=${selectedCategory.id}`
        );
        setGroups(response.data);
      }
    };
    fetchGroups();
  }, [selectedCategory]);

  if (!selectedCategory) {
    return (
      <section className="categories">
        {categories.map((category) => {
          const { name, picture } = category;
          return (
            <>
              <header
                onClick={() => handleChangeCategory(category)}
                className="category-article"
              >
                <img
                  src={picture.data}
                  alt={picture.name}
                  className="category-article-image"
                />
                <h4>{name}</h4>
              </header>
            </>
          );
        })}
      </section>
    );
  } else {
    return (
      <>
        <section className="categories">
          {categories.map((category) => {
            const { id, name, picture } = category;
            return (
              <>
                {selectedCategory.name === name && (
                  <header
                    onClick={() => handleChangeCategory(category)}
                    className="category-article"
                  >
                    <img
                      src={picture.data}
                      alt={picture.name}
                      className="category-article-image"
                    />
                    <h4>{name}</h4>
                  </header>
                )}
                {selectedCategory?.name === name && groups.length !== 0 && (
                  <>
                    {groups.map((group, i) => {
                      const { name, picture, id } = group;
                      return (
                        <Link
                          key={i}
                          to={`/categories/group/${id}`}
                          className="category-article"
                        >
                          <img
                            src={picture.data}
                            alt={picture.name}
                            className="subcategory-article-image"
                          />
                          {name}
                        </Link>
                      );
                    })}
                  </>
                )}
              </>
            );
          })}
        </section>
        <section className="categories">
          {categories.map((category, index) => {
            if (category.name !== selectedCategory.name) {
              return (
                <header
                  key={index}
                  onClick={() => handleChangeCategory(category)}
                  className="category-article"
                >
                  <img
                    src={category.picture.data}
                    alt={category.picture.name}
                    className="category-article-image"
                  />
                  <h4>{category.name}</h4>
                </header>
              );
            }
            return null;
          })}
        </section>
      </>
    );
  }
};
export default Categories;

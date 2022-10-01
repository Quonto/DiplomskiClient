import { useEffect, useState } from "react";
import "./categories.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      let response;
      try {
        response = await axios.get(
          "https://localhost:7113/Category/FetchCategories"
        );
      } catch (error) {
        return;
      }
      setCategories(response.data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (selectedCategory) {
        setLoading(true);
        let response;
        try {
          response = await axios.get(
            `https://localhost:7113/Group/FetchGroups/${selectedCategory.id}`
          );
        } catch (error) {
          return;
        }
        setGroups(response.data);
        setLoading(false);
      }
    };
    fetchGroups();
  }, [selectedCategory]);

  if (!selectedCategory) {
    return (
      <>
        {loading ? (
          <h2>Loading</h2>
        ) : (
          <section className="categories">
            {categories.map((category, index) => {
              const { name, picture } = category;
              return (
                <article key={index}>
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
                </article>
              );
            })}
          </section>
        )}{" "}
      </>
    );
  } else {
    return (
      <>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <section className="categories">
              {categories.map((category, index) => {
                const { name, picture } = category;
                return (
                  <article className="artile-category" key={index}>
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
                  </article>
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
            </section>{" "}
          </>
        )}
      </>
    );
  }
};
export default Categories;

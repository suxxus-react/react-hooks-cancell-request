import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const API_URL = "https://dummyjson.com";
const PRODUCTS_URL = "/products";
const CATEGORIES_URL = `${PRODUCTS_URL}/category`;

function ProductByCategory({ category }: { category: string }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let controller = new AbortController();
  const signal = controller.signal;

  const url = `${API_URL}${CATEGORIES_URL}/${category}`;

  const getProducts = async () => {
    try {
      const res = await fetch(url, {
        signal,
        method: "GET",
        headers: {
          "Content-Type": "application-json",
        },
      });

      const data = await res.json();
      setIsLoading(false);
      return data;
      //
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.count("cancelled");
      }
    }
  };

  useEffect(() => {
    const searchProds = category !== "/";

    if (searchProds) {
      setIsLoading(true);
      getProducts()
        .then((data) => {
          const prods = data?.products || [];
          setProducts(prods);
        })
        .catch((e) => {
          console.error(e.message);
        });
    } else {
      setProducts([]);
    }

    return () => {
      controller.abort();
    };
  }, [category]);

  return (
    <>
      {isLoading && <h3>Loading...</h3>}
      <ul>
        {products.map(({ id, title, thumbnail }) => (
          <li key={id}>
            <h3>{title}</h3>
            <img alt={title} src={thumbnail} width="120" />
          </li>
        ))}
      </ul>
    </>
  );
}

function App(): JSX.Element {
  const category = useLocation().pathname.split("/").reverse().at(0) || "/";

  const categoriesSelection = {
    listStyleType: "none",
    display: "flex",
    gap: "5px",
  };

  const link = {
    textDecoration: "none",
    color: "gray",
    border: "1px solid gray",
    padding: "5px",
  };

  return (
    <>
      <h1>My prods</h1>
      <div>
        <ul style={categoriesSelection}>
          <li>
            <Link to="/" style={link}>
              none
            </Link>
          </li>
          <li>
            <Link to="/products/categories/smartphones" style={link}>
              smartphones
            </Link>
          </li>
          <li>
            <Link to="/products/categories/laptops" style={link}>
              {" "}
              laptops
            </Link>
          </li>
          <li>
            <Link to="/products/categories/furniture" style={link}>
              furnitures
            </Link>
          </li>
        </ul>
      </div>
      <hr />
      {/*category && <ProductByCategory category={category} />*/}
      <ProductByCategory category={category} />
    </>
  );
}
export default App;

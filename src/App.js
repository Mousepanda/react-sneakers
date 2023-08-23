import React from "react";
import { Routes, Route } from 'react-router-dom';
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

export const AppContext = React.createContext({});

function App() {
	const [items, setItems] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [favorites, setFavorites] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState('');
	const [cartOpened, setCartOpened] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchData() {
			const cartResponse = await axios.get('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart');
			const favoriteResponse = await axios.get('https://64cb7fc9700d50e3c705ff63.mockapi.io/favorites');
			const itemsResponse = await axios.get('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/items');

			setIsLoading(false);

			setCartItems(cartResponse.data);
			setFavorites(favoriteResponse.data);
			setItems(itemsResponse.data);

		}

		fetchData();
	}, [])

	const onAddToCart = (obj) => {
		try {
			if (cartItems.find(item => Number(item.id) === Number(obj.id))) {
				axios.delete(`https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart/${obj.id}`);
				setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
			} else {
				axios.post('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart', obj);
				setCartItems((prev) => [...prev, obj]);
			}
		} catch (error) {

		}
	}

	const onRemoveToCart = (id) => {
		axios.delete(`https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart/${id}`);
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	}

	const onAddToFavorite = async (obj) => {
		try {
			if (favorites.find(Favobj => Favobj.id === obj.id)) {
				axios.delete(`https://64cb7fc9700d50e3c705ff63.mockapi.io/favorites/${obj.id}`);
				setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
			} else {
				const { data } = await axios.post('https://64cb7fc9700d50e3c705ff63.mockapi.io/favorites', obj);
				setFavorites((prev) => [...prev, data]);
			};
		} catch (error) {
			alert('Не удалось добавить в закладки');
		}
	}

	const onChangeSearchInput = (event) => {
		setSearchValue(event.target.value);
	}

	const isItemAdded = (id) => {
		return cartItems.some((obj) => Number(obj.id) === Number(id));
	};


	return (
		<AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, setCartOpened, setCartItems}}>
			<div className="wrapper clear">
			{cartOpened && <Drawer items={cartItems} onRemove={onRemoveToCart} onClose={() => setCartOpened(false)} />}
			<Header onClickCart={() => setCartOpened(true)} />

			<Routes>
				<Route path="/" element={<Home
					items={items}
					cartItems={cartItems}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					onChangeSearchInput={onChangeSearchInput}
					onAddToCart={onAddToCart}
					onAddToFavorite={onAddToFavorite}
					isLoading={isLoading}
				/>} />
				<Route path="/favorites" element={<Favorites/>} />
			</Routes>

		</div>
		</AppContext.Provider>
	);
}

export default App;

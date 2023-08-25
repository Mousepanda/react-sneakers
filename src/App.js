import React from "react";
import { Routes, Route } from 'react-router-dom';
import axios from "axios";

import Header from "./components/Header";
import Drawer from "./components/Drawer";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

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
			try {
				const [cartResponse, favoriteResponse, itemsResponse ] = 
				await Promise.all([
					axios.get('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart'), 
					axios.get('https://64cb7fc9700d50e3c705ff63.mockapi.io/favorites'), 
					axios.get('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/items')
			]);

				setIsLoading(false);
	
				setCartItems(cartResponse.data);
				setFavorites(favoriteResponse.data);
				setItems(itemsResponse.data);
			} catch (error) {
				alert('Ошибка при запросе данных ;(');
				console.error(error);
			}
		}

		fetchData();
	}, [])

	const onAddToCart = async (obj) => {
		try {
			const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id))
			if (findItem) {
				setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
				await axios.delete(`https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart/${findItem.id}`);
			} else {
				setCartItems((prev) => [...prev, obj]);
				const {data} = await axios.post('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart', obj);
				setCartItems((prev) => prev.map(item => {
					if (item.parentId === data.parentId) {
						return {
							...item,
							id: data.id
						};
					}
					return item;
				}));
			}
		} catch (error) {
			alert('Ошибка при добавлении в корзину ;(');
			console.error(error);
		}
	}

	const onRemoveToCart = (id) => {
		try {
			axios.delete(`https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart/${id}`);
			setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
		} catch (error) {
			alert('Ошибка при удалении из корзины ;(');
			console.error(error);
		}
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
			console.error(error);
		}
	}

	const onChangeSearchInput = (event) => {
		setSearchValue(event.target.value);
	}

	const isItemAdded = (id) => {
		return cartItems.some((obj) => Number(obj.parentId) === Number(id));
	};


	return (
		<AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart, setCartOpened, setCartItems}}>
			<div className="wrapper clear">
			
			<Drawer items={cartItems} onRemove={onRemoveToCart} onClose={() => setCartOpened(false)} opened={cartOpened} />

			<Header onClickCart={() => setCartOpened(true)} />

			<Routes>
				<Route path="" element={<Home
					items={items}
					cartItems={cartItems}
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					onChangeSearchInput={onChangeSearchInput}
					onAddToCart={onAddToCart}
					onAddToFavorite={onAddToFavorite}
					isLoading={isLoading}
				/>} />
				<Route path="favorites" element={<Favorites/>} />
				<Route path="orders" element={<Orders
				ff
				/>} />
			</Routes>

		</div>
		</AppContext.Provider>
	);
}

export default App;

import Card from "./components/Card";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import React from "react";
import axios from "axios";


function App() {
	const [items, setItems] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState('');
	const [cartOpened, setCartOpened] = React.useState(false);

	React.useEffect(() => {
		axios.get('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/items').then((res) => {
			setItems(res.data);
		});
		axios.get('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart').then((res) => {
			setCartItems(res.data);
		});
	}, [])

	const onAddToCart = (obj) => {
		axios.post('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart', obj);
		setCartItems((prev) => [...prev, obj]);
	}

	const onRemoveToCart = (id) => {
		axios.delete(`https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart/${id}`);
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	}


	const onChangeSearchInput = (event) => {
		setSearchValue(event.target.value);
	}


	return (
		<div className="wrapper clear">
			{cartOpened && <Drawer items={cartItems} onRemove={onRemoveToCart} onClose={() => setCartOpened(false)} />}
			<Header onClickCart={() => setCartOpened(true)} />
			<div className="content p-40">
				<div className="d-flex align-center mb-40 justify-between">
					<h1>{searchValue ? `Поиск по запросу:  "${searchValue}"` : "Все кроссовки"}</h1>
					<div className="search-block d-flex">
						<img src="/img/search.svg" alt="Search" />
						{searchValue && <img onClick={() => setSearchValue('')} className="clear cu-p" src="/img/cart-active.svg" alt="Remove" />}
						<input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
					</div>
				</div>

				<div className="d-flex flex-wrap">
					{
						items.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase())).map((item, index) => (
							<Card
								key={index}
								title={item.title}
								price={item.price}
								imageUrl={item.imageUrl}
								onClickFavorite={() => console.log('Добавили в закладки')}
								onPlus={(obj) => onAddToCart(obj)}
							/>
						))}
				</div>
			</div>
		</div>
	);
}

export default App;

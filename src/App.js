import Card from "./components/Card";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import React from "react";


function App() {
	const [items, setItems] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [cartOpened, setCartOpened] = React.useState(false);

	React.useEffect(() => {
		fetch('https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/items').then(res => {
			return res.json();
		}).then(json => {
			setItems(json);
		});
	}, [])

	const onAddToCart = (obj) => {
		setCartItems((prev) => [...prev, obj]);
	}

	const onRemoveToCart = (obj) => {
		setCartItems((prev) => prev.filter((item) => item !== obj));
	}
	

	return (
		<div className="wrapper clear">
			{cartOpened && <Drawer items={cartItems} onRemove={(obj) => onRemoveToCart(obj)} onClose={() => setCartOpened(false)} />}
			<Header onClickCart={() => setCartOpened(true)} />
			<div className="content p-40">
				<div className="d-flex align-center mb-40 justify-between">
					<h1>Все кроссовки</h1>
					<div className="search-block d-flex">
						<img src="/img/search.svg" alt="Search" />
						<input placeholder="Поиск..." />
					</div>
				</div>

				<div className="d-flex flex-wrap">
					{
						items.map((item) => (
							<Card
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

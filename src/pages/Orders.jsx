import React from "react";
import Card from "../components/Card";

import axios from "axios";



function Orders() {
	const [orders, setOrders] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get('https://64cb7fc9700d50e3c705ff63.mockapi.io/orders');
				console.log()
				setOrders(data.map((obj) => obj.items).flat());
				setIsLoading(false);
			} catch (error) {
				alert('Не удалось загрузить заказы');
				console.log(error)
			}
		})();
	}, []);

	return (
		<div className="content p-40">
			<div className="d-flex align-center mb-40 justify-between">
				<h1>Мои заказы</h1>
			</div>

			<div className="d-flex flex-wrap">
				{
					(isLoading ? [...Array(8)] : orders).map((item, index) => (
						<Card
							key={index}
							loading={isLoading}
							{...item}
						/>
					))}
			</div>
		</div>
	);
}

export default Orders;